import type { AppLocale } from '../i18n/config'

export type AIIntent = 'technical' | 'macro' | 'risk'

const SCRIPTS: Record<'zh-CN' | 'en', Record<AIIntent, string>> = {
  'zh-CN': {
    technical:
      '【演示】EURUSD 4H：价格位于近期震荡区间中轴附近，结构上更偏区间交易而非单边趋势。若上破 1.0920 阻力区，短线或测试 1.0960；若失守 1.0780 支撑带，回撤目标看向 1.0720。以上仅为技术形态描述，不构成投资建议。',
    macro:
      '【演示】今日宏观关注点：通胀数据预期差可能放大美元波动；欧元区 PMI 若弱于预期，或压制欧元反弹空间。建议结合事件窗口降低杠杆，并预留滑点与跳空风险。演示内容，非研究结论。',
    risk:
      '【演示】风控清单：单笔风险建议不超过净值的 1%（演示参数）；重要数据前后可缩小仓位或使用更宽止损；确保保证金比例安全垫充足。AI 输出为教育性演示，请遵循自身风险承受能力。',
  },
  en: {
    technical:
      '[Demo] EURUSD 4H: Price sits near the middle of a recent range; the structure skews toward range trading rather than a one-way trend. A break above ~1.0920 may lead to ~1.0960; losing ~1.0780 could aim for ~1.0720. Commentary only — not investment advice.',
    macro:
      '[Demo] Macro focus: inflation surprises can amplify USD volatility; weaker Eurozone PMI could limit EUR rebounds. Around data releases, consider lower leverage and plan for gaps/slippage. Demo content, not research.',
    risk:
      '[Demo] Risk checklist: keep per-trade risk modest (demo uses ≤1% equity as an example); reduce exposure before major events; maintain margin headroom. Educational demo only.',
  },
}

export function getAIScript(locale: AppLocale, intent: AIIntent): string {
  const pack = locale === 'zh-CN' ? SCRIPTS['zh-CN'] : SCRIPTS.en
  return pack[intent]
}
