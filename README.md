# AI Trading Demo

一个面向交易终端场景的前端演示项目，主打高密度信息展示、行情联动、K 线分析和 AI 辅助交互。

> 本项目仅用于 UI 与交互演示，不构成任何投资建议；行情、持仓、AI 回复与交易结果均为模拟数据。

## 项目特点

- 多模块交易工作台：行情、自选、K 线、交易面板、资产概览、AI 助手
- 强联动交互：切换标的、周期、主题时，相关模块同步更新
- 高性能展示：行情虚拟列表、`memo` 优化、图表独立渲染
- AI 交互模拟：支持上下文问答与分块输出
- 多端适配：桌面端高密度布局，移动端纵向信息流

## 技术栈

- `React 19` + `TypeScript`
- `Vite`
- `i18next` / `react-i18next`
- `lightweight-charts`
- `@tanstack/react-virtual`

## 本地运行

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

## 目录结构

```text
src/
├── components/
├── locales/
├── styles/
├── utils/
└── ...
```

## 预览与部署

- 演示地址：`https://josie-ljw.github.io/trading-web-UI/`
- 源码仓库：`github.com/Josie-ljw/trading-web-UI`

部署到其他静态站点时，注意检查 `VITE_BASE` 配置是否正确。

## 声明

仅用于演示，不构成投资建议。