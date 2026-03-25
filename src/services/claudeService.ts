import type { Identity, DesignEvent, FurnitureItem, Inference, DecisionLedgerData } from '../types'
import { dreamItems } from '../data/dreamItems'

async function callClaude(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `HTTP ${response.status}`)
  }

  const data = await response.json()
  return data.content[0].text
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

請生成 4 條「決策推論」，每條要求：
1. 以「系統觀察到您」開頭
2. 具體指出一個家具或操作行為，點出其背後的取捨
3. 全文控制在 30 字以內，言簡意賅
4. 繁體中文

僅回傳純 JSON 陣列，不含 markdown 或其他文字：
[{"id":"1","text":"系統觀察到您..."},{"id":"2","text":"..."}]`

  const raw = (await callClaude(prompt)).trim()
    .replace(/^```json\s*/i, '').replace(/```$/, '').trim()
  const parsed = JSON.parse(raw) as { id: string; text: string }[]
  return parsed.map((item) => ({ ...item, rating: null }))
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
    .filter((i) => (i.rating ?? 0) >= 4)
    .map((i) => `[精準度${i.rating}/5] ${i.text}`)
    .join('\n')

  const corrected = inferences
    .filter((i) => (i.rating ?? 5) <= 2 && i.userCorrection)
    .map((i) => `[精準度${i.rating}/5] AI推論：「${i.text}」→ 使用者修正：「${i.userCorrection}」`)
    .join('\n')

  const prompt = `你是一位空間設計分析師，同時熟悉台灣建築法規。根據以下使用者的設計資料，生成「決策分類帳」。

【使用者身分】${identity.label}
【夢幻清單】${dreamLabels}${customDream ? `（另：${customDream}）` : ''}

【確認正確的推論】
${confirmed || '（無）'}

【使用者修正的推論】
${corrected || '（無）'}

【參考法規標準（台灣建築技術規則）】
- 居室最小面積：6 平方公尺
- 最低樓高：2.1 公尺（一般居室建議 2.4 公尺以上）
- 採光：開窗面積需達居室面積 1/8 以上
- 通風：開口面積需達居室面積 1/10 以上
- 本案套房面積：15 平方公尺（僅供 1 人居住之最低標準邊界）

請生成「決策分類帳」，包含四個部分：
1. values：前三名核心價值觀，label 不超過 4 字，reason 一句說明（20 字內）
2. designRationality：評估設計合理性
   - rating：「合理」「尚可」「待改善」三選一
   - assessment：1 句總體評估（25 字內）
   - issues：具體問題列表（若無問題則空陣列），每項不超過 20 字
3. designInterpretation：1~2 句有溫度的整體詮釋
4. spaceParameters：3~5 條「專屬空間參數」，把使用者的感性選擇翻譯成建築語彙
   - label：參數名稱，格式如「絕對限制 01」「機能佔比 02」「彈性空間 03」
   - value：具體的建築/空間描述（30 字內），如「無障礙迴轉半徑 150cm 優先級最高」

僅回傳純 JSON，不含 markdown：
{"values":[{"rank":1,"label":"...","reason":"..."},{"rank":2,"label":"...","reason":"..."},{"rank":3,"label":"...","reason":"..."}],"designRationality":{"rating":"合理","assessment":"...","issues":[]},"designInterpretation":"...","spaceParameters":[{"label":"絕對限制 01","value":"..."},{"label":"機能佔比 02","value":"..."}]}`

  const raw = (await callClaude(prompt)).trim()
    .replace(/^```json\s*/i, '').replace(/```$/, '').trim()
  return JSON.parse(raw) as DecisionLedgerData
}
