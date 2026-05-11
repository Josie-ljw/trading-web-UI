# AI Trading Demo · 高密度交易工作台

面向券商与金融科技场景的前端演示：在单页内整合市场分类、行情表、K 线主图、快捷下单、资产看板与 AI 助手，模拟真实交易终端的信息密度与交互路径。**所有数据均为前端演示生成，非真实行情，亦不构成投资建议。**

部署成功后的**静态预览地址**（项目页站点，用户名小写）：  
**[https://josie-ljw.github.io/trading-web-demo/](https://josie-ljw.github.io/trading-web-demo/)**

源码仓库： [github.com/Josie-ljw/trading-web-demo](https://github.com/Josie-ljw/trading-web-demo)

---

## GitHub Pages 部署步骤（得到可访问的预览链接）

仓库里已有工作流 [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)：推送 `main` 时会构建 Vite 产物并发布到 Pages。**首次使用前必须在网页里打开一次 Pages 开关**，否则部署步骤会报「Pages 未启用」类错误。

### 1. 确认 Actions 可用

1. 打开：<https://github.com/Josie-ljw/trading-web-demo/settings/actions>  
2. **General** → **Actions permissions** 选 **Allow all actions and reusable workflows**（或至少允许本仓库工作流）。

### 2. 把 Pages 改为「由 GitHub Actions 发布」（必做）

1. 打开：<https://github.com/Josie-ljw/trading-web-demo/settings/pages>  
2. **Build and deployment** 区域里，**Source** 不要选「Deploy from a branch」。  
3. 在下拉框中选择 **GitHub Actions**。  
4. 若页面提示选择工作流，选 **Deploy to GitHub Pages**（与仓库内 yaml 名称一致即可）。

完成后再去 **Actions** 标签页，对最近一次失败的工作流点 **Re-run all jobs**；或向 `main` 再推送任意提交触发新一次构建。

### 3. 等待流水线变绿

1. 打开：<https://github.com/Josie-ljw/trading-web-demo/actions>  
2. 进入 **Deploy to GitHub Pages** 这条 workflow，确认 **build** 与 **deploy** 两个 job 均成功。  
3. 首次使用 `actions/deploy-pages` 时，若出现 **Environment** 审批提示，在运行页点击 **Review deployments** → 勾选 **github-pages** → **Approve and deploy**（仅首次常见）。

### 4. 打开预览地址

浏览器访问（末尾斜杠可加可不加）：  

`https://josie-ljw.github.io/trading-web-demo/`

若仍为 404：等待 1～3 分钟 CDN 刷新；或到 **Settings → Pages** 查看是否已显示 **Your site is live at …** 的链接。

### 5.（可选）用命令行开启 Pages

已安装 [GitHub CLI](https://cli.github.com/) 且已执行 `gh auth login` 时：

```bash
echo '{"build_type":"workflow","source":{"branch":"main","path":"/"}}' | \
  gh api --method POST repos/Josie-ljw/trading-web-demo/pages --input -
```

若返回 **409**，表示 Pages 已存在，可查看当前配置：

```bash
gh api repos/Josie-ljw/trading-web-demo/pages
```

使用 **Personal access token** 时，可对 `https://api.github.com/repos/Josie-ljw/trading-web-demo/pages` 发送 **POST**，请求体同上，详见 [Create a GitHub Pages site](https://docs.github.com/en/rest/pages/pages?apiVersion=2022-11-28#create-a-github-pages-site)；Token 需有该仓库的管理权限（如 `repo` 范围）。

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
