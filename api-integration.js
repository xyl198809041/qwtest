// AI几何画板API集成模块
class GeoGebraAIApi {
    constructor(apiConfig) {
        this.apiKey = apiConfig.apiKey || '';
        this.apiUrl = apiConfig.apiUrl || 'https://api.openai.com/v1/chat/completions';
        this.model = apiConfig.model || 'gpt-3.5-turbo';
    }

    // 发送请求到AI模型以生成GeoGebra代码
    async generateCode(prompt) {
        const systemPrompt = `你是一个专业的几何学专家和GeoGebra代码生成器。根据用户提供的几何描述，生成对应的GeoGebra命令代码。只需要返回GeoGebra代码，不要添加任何解释。

GeoGebra代码示例：
- 圆：Circle((0, 0), 3) 表示圆心在原点，半径为3的圆
- 点：Point((2, 3)) 表示坐标为(2,3)的点
- 线段：Segment((0, 0), (5, 5)) 表示从(0,0)到(5,5)的线段
- 直线：Line((0, 0), (1, 1)) 表示通过两点的直线
- 多边形：Polygon((0, 0), (4, 0), (4, 3)) 表示三角形
- 函数：f(x) = x^2 表示二次函数
- 椭圆：Ellipse((0, 0), (3, 0), (0, 2)) 表示椭圆
- 抛物线：Parabola((0, 0), Line((0, -1), (1, -1))) 表示抛物线
- 双曲线：Hyperbola((0, 0), 2, 1) 表示双曲线`;

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.3,
                    max_tokens: 200
                })
            });

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const generatedCode = data.choices[0].message.content.trim();
            
            // 清理返回的代码，去除可能的markdown格式
            return generatedCode.replace(/```[\s\S]*?\n?/g, '').trim();
        } catch (error) {
            console.error('API调用错误:', error);
            throw error;
        }
    }
}

// 扩展原始的GeoGebra工具类以支持API集成
class EnhancedGeoGebraApp {
    constructor(containerId, apiConfig = null) {
        this.containerId = containerId;
        this.ggbApplet = null;
        this.apiClient = apiConfig ? new GeoGebraAIApi(apiConfig) : null;
        this.init();
    }

    init() {
        const params = {
            'width': document.getElementById(this.containerId).offsetWidth,
            'height': document.getElementById(this.containerId).offsetHeight,
            'material_id': '',
            'showToolBar': true,
            'borderColor': null,
            'showMenuBar': false,
            'enableLabelDrags': false,
            'enableShiftDragZoom': true,
            'capturingThreshold': null,
            'showToolBarHelp': false,
            'errorDialogsActive': true,
            'showResetIcon': true
        };

        this.ggbApplet = new GGBApplet(params, '5.0', this.containerId);
        this.ggbApplet.inject();
    }

    // 使用AI API生成并执行GeoGebra代码
    async generateAndExecute(prompt) {
        if (!this.apiClient) {
            throw new Error('API客户端未配置');
        }

        // 显示加载状态
        this.showStatus('正在通过AI生成几何图形...', 'loading');

        try {
            // 生成GeoGebra代码
            const code = await this.apiClient.generateCode(prompt);
            
            // 显示生成的代码
            document.getElementById('generated-code').value = code;

            // 清除之前的图形
            this.clearAll();

            // 执行生成的命令
            this.executeCommand(code);
            
            this.showStatus('图形生成成功！', 'success');
            return code;
        } catch (error) {
            this.showStatus(`生成图形时出错: ${error.message}`, 'error');
            throw error;
        }
    }

    // 执行GeoGebra命令
    executeCommand(command) {
        if (this.ggbApplet && typeof this.ggbApplet.evalCommand === 'function') {
            try {
                this.ggbApplet.evalCommand(command);
            } catch (e) {
                throw new Error(`执行GeoGebra命令时出错: ${e.message}`);
            }
        } else {
            throw new Error('GeoGebra应用未正确初始化');
        }
    }

    // 清除所有图形
    clearAll() {
        if (this.ggbApplet && typeof this.ggbApplet.evalCommand === 'function') {
            this.ggbApplet.evalCommand('DeleteAll()');
        }
    }

    // 调整大小
    resize() {
        if (this.ggbApplet) {
            this.ggbApplet.setSize(
                document.getElementById(this.containerId).offsetWidth,
                document.getElementById(this.containerId).offsetHeight
            );
        }
    }

    // 显示状态信息
    showStatus(message, type) {
        const statusDiv = document.getElementById('status');
        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.className = 'status ' + type;
        }
    }
}

// 配置示例
/*
const apiConfig = {
    apiKey: 'your-openai-api-key-here',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo'
};

const geoGebraApp = new EnhancedGeoGebraApp('ggb-container', apiConfig);

// 使用示例
document.getElementById('submit-btn').addEventListener('click', async function() {
    const prompt = document.getElementById('prompt-input').value.trim();
    if (!prompt) {
        geoGebraApp.showStatus('请输入几何描述', 'error');
        return;
    }
    
    this.disabled = true;
    try {
        await geoGebraApp.generateAndExecute(prompt);
    } catch (error) {
        console.error('执行失败:', error);
    } finally {
        this.disabled = false;
    }
});
*/