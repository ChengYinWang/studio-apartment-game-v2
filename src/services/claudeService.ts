import Anthropic from '@anthropic-ai/sdk'
import type { Identity, DesignEvent, FurnitureItem, Inference, DecisionLedgerData } from '../types'
import { dreamItems } from '../data/dreamItems'

function getClient() {
  return new Anthropic({
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY ?? '',
    dangerouslyAllowBrowser: true,
  })
}

// ── Stage 4: Generate inferences ────────────────────────────────────────────
export async function generateInferences(params: {
  identity: Identity
  selectedDreams: string[]
  customDream: string
  designEvents: DesignEvent[]
  finalFurniture: FurnitureItem[]
}): Promise<Inference[]> {
  const { identity, selectedDreams, customDream, designEvents, finalFurniture } = params

  const dreamLabels = selectedDreams
    .map((id) => dreamItems.find((d) => d.id === id)?.label ?? id)
    .join('、')

  const eventsText = designEvents
    .map((e) => {
      const action = e.type === 'add' ? '放入' : e.type === 'remove' ? '移除' : '移動'
      return `${action}「${e.furnitureLabel}」`
    })
    .join('\n')

  const finalText = finalFurniture.map((f) => f.label).join('、')

  const prompt = `你是一位空間心理分析師。請根據以下使用者的設計紀錄，分析其決策背後的價值觀取捨。

【使用者身分】${identity.label}（${identity.tagline}）
【身分空間限制】${identity.constraints.join('；')}
【夢幻清單】${dreamLabels}${customDream ? `（其他備註：${customDream}）` : ''}

【設計操作紀錄（依時序）】
${eventsText || '（使用者未進行任何操作）'}

【最終室內配置家具】
${finalText}

請生成 4~5 條「決策推論」，每條要求：
1. 具體引用曾操作過的家具或最終配置
2. 點出夢幻條件與身分限制之間的取捨張力
3. 繁體中文，語氣客觀但帶洞察感
4. 以「系統觀察到您」開頭

僅回傳純 JSON 陣列，不含 markdown 或其他文字：
[{"id":"1","text":"系統觀察到您..."},{"id":"2","text":"..."}]`

    const response = await getClient().messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = (response.content[0] as { type: string; text: string }).text.trim()
  const parsed = JSON.parse(raw) as { id: string; text: string }[]
  return parsed.map((item) => ({ ...item, confirmed: null }))
}

// ── Stage 5: Generate decision ledger ───────────────────────────────────────
export async function generateLedger(params: {
  identity: Identity
  selectedDreams: string[]
  customDream: string
  inferences: Inference[]
}): Promise<DecisionLedgerData> {
  const { identity, selectedDreams, customDream, inferences } = params

  const dreamLabels = selectedDreams
    .map((id) => dreamItems.find((d) => d.id === id)?.label ?? id)
    .join('、')

  const confirmed = inferences
    .filter((i) => i.confirmed === true)
    .map((i) => `✓ ${i.text}`)
    .join('\n')

  const corrected = inferences
    .filter((i) => i.confirmed === false && i.userCorrection)
    .map((i) => `✗ AI推論：「${i.text}」→ 使用者修正：「${i.userCorrection}」`)
    .join('\n')

  const prompt = `你是一位空間哲學家。根據以下使用者確認與修正過的決策推論，生成一份「決策分類帳」，深刻揭示其空間使用的核心價值觀。

【使用者身分】${identity.label}
【夢幻清單】${dreamLabels}${customDream ? `（另：${customDream}）` : ''}

【確認正確的推論】
${confirmed || '（無）'}

【使用者修正的推論】
${corrected || '（無）'}

請生成「決策分類帳」，要求：
- values：前三名核心價值觀，label 不超過 4 字，reason 一句說明
- decisionPattern：2~3 句分析使用者在限制下的決策模式
- spacePhilosophy：詩意的 2~3 句，描述使用者的空間哲學

僅回傳純 JSON，不含 markdown：
{"values":[{"rank":1,"label":"...","reason":"..."},{"rank":2,"label":"...","reason":"..."},{"rank":3,"label":"...","reason":"..."}],"decisionPattern":"...","spacePhilosophy":"..."}`

    const response = await getClient().messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = (response.content[0] as { type: string; text: string }).text.trim()
  return JSON.parse(raw) as DecisionLedgerData
}
