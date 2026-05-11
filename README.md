# AI Trading Demo · 高密度交易工作台

面向券商与金融科技场景的前端演示：在单页内整合市场分类、行情表、K 线主图、快捷下单、资产看板与 AI 助手，模拟真实交易终端的信息密度与交互路径。**所有数据均为前端演示生成，非真实行情，亦不构成投资建议。**

**在线预览**（仓库需先在 Settings → Pages 中启用 GitHub Actions 作为部署来源）：  
[https://josie-ljw.github.io/trading-web-demo/](https://josie-ljw.github.io/trading-web-demo/)

源码： [github.com/Josie-ljw/trading-web-demo](https://github.com/Josie-ljw/trading-web-demo)

---

## 复杂度与技术要点

- **多模块状态联动**：市场 Tab、选中品种、图表周期、均线开关、交易面板与 AI 上下文需保持一致；品种切换时需在分类内自动回退可选标的，避免悬空状态。
- **行情与渲染**：全市场定时报价更新（随机游走 + 可变点差模型）；行情表在品种规模增大时依赖 **虚拟列表**（`@tanstack/react-virtual`）与行级 `memo`，控制滚动与重绘成本。
- **图表层**：基于 **TradingView Lightweight Charts** 的蜡烛图与 MA(20) 叠加；深浅主题切换时图表配色与 CSS 变量需同步，避免「壳换肤、图不换肤」的割裂。
- **K 线与时间轴**：本地按品种基准价与周期生成 OHLC；细周期下时间轴需支持秒级展示等与数据粒度相关的配置。
- **跨标签协同**：自选列表通过 `localStorage` 持久化，并用 **BroadcastChannel** 在多标签页之间同步，演示浏览器侧状态广播的典型用法。
- **国际化与可访问性**：`react-i18next` 管理 zh-CN / en；行情行支持键盘操作（Enter / Space）以符合表格类交互预期。
- **AI 交互（无后端）**：快捷意图与多语言剧本驱动回复；通过 `requestAnimationFrame` 分块输出文本，模拟流式响应，便于单独演示前端表现层。
- **部署路径**：静态资源 `base` 由环境变量 `VITE_BASE` 注入，CI 中对 GitHub Pages 子路径（`/trading-web-demo/`）与本地根路径构建分别适配。

---

## 产品设计概要

- **信息结构**：顶栏与合规说明 → 账户摘要条 → 市场范围 Tab → 三栏工作台（行情 | 主图 | 交易）→ 底部资产与资讯 → 全局 AI 浮层。
- **语义对齐**：点差、涨跌百分比、手数、名义价值与保证金等字段对齐常见交易端表述，数值与结论仍为演示用途。
- **AI 策略助手**：技术 / 宏观 / 风控等快捷意图与自由输入并存；剧本与回显逻辑集中在 `aiScripts`、`aiEchoReply` 等数据层，便于替换为真实接口。

---

## 技术栈与目录级架构

```
React 19 + TypeScript + Vite 8
├── 国际化：react-i18next（zh-CN / en）
├── 主题：CSS 变量 + ThemeProvider（深/浅）
├── 行情：QuoteProvider（定时全市场更新）→ useQuotes
├── 行情表：TanStack Virtual + memo 行组件
├── K 线：lightweight-charts（Candlestick + MA，主题调色板）
├── 自选：useWatchlist → localStorage + BroadcastChannel
└── 部署：GitHub Actions → GitHub Pages（CI 内 VITE_BASE=/trading-web-demo/）
```

- **K 线数据**：`generateCandles` / `computeSMA` 等模块负责本地序列生成与指标计算。
- **构建**：`npm run build` 前执行 `tsc -b` 做类型检查；生产资源路径由 `VITE_BASE` 控制。

---

## 本地开发

环境要求：**Node.js ≥ 22**

```bash
npm ci
npm run dev
```

| 命令 | 作用 |
|------|------|
| `npm run build` | 类型检查 + Vite 生产构建（默认 `base` 为 `/`） |
| `npm run preview` | 预览构建产物 |
| `npm run lint` | ESLint |

---

## 免责声明

本项目仅用于 **UI、交互与技术演示**，不构成任何投资建议；行情、持仓与 AI 输出均为模拟数据。
