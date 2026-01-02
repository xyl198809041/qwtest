# AI几何画板

一个基于Web的AI驱动几何画板，能够将自然语言描述转换为GeoGebra几何图形。

## 功能特点

- 输入自然语言几何描述
- AI自动生成GeoGebra代码
- 实时渲染几何图形
- 显示生成的代码供学习参考
- 支持多种几何图形：点、线、圆、多边形、函数等

## 技术架构

- HTML5 + CSS3 + JavaScript
- GeoGebra Web API
- AI模型集成（支持OpenAI等API）

## 使用方法

### 本地运行

1. 直接在浏览器中打开 `index.html` 文件
2. 在输入框中输入几何描述，例如：
   - "绘制一个半径为3的圆，圆心在原点"
   - "画一个三角形，顶点在(0,0), (4,0), (2,3)"
   - "绘制函数 y = x^2"
3. 点击"生成图形"按钮或按回车键

### 集成真实AI API

如需使用真实的大模型API：

1. 打开 `index.html` 文件
2. 找到脚本中的API配置部分
3. 替换 `your-openai-api-key-here` 为你的实际API密钥
4. 取消注释相关代码

## 支持的几何描述类型

- **圆形**: "画一个圆，圆心在原点，半径为5"
- **多边形**: "绘制三角形/正方形/矩形"
- **直线**: "画一条直线穿过点(0,0)和(5,5)"
- **函数**: "绘制二次函数 y = x^2"
- **点**: "在(2,3)处放置一个点"

## 文件结构

```
/workspace/
├── index.html        # 主页面
├── api-integration.js # API集成代码
└── README.md         # 说明文档
```

## API集成说明

`api-integration.js` 文件包含以下主要类：

- `GeoGebraAIApi`: 处理AI模型API请求
- `EnhancedGeoGebraApp`: 扩展的GeoGebra应用类

## 自定义配置

在 `index.html` 中可以配置：

- API端点URL
- 模型类型
- API密钥
- GeoGebra参数

## 注意事项

- 需要网络连接以加载GeoGebra库
- 使用真实AI API时需要有效的API密钥
- 某些复杂几何描述可能需要精确的语言表达