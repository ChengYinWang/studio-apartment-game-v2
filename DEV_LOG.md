# 開發日誌 — 2026-03-18

## 本次開發概覽

今天共完成兩個專案的開發與修正：

1. **studio-apartment-designer**（原有專案）— 修復 bug、優化範本
2. **studio-apartment-game**（全新專案）— 從零建立 5 階段 AI 設計體驗遊戲

---

## 專案一：studio-apartment-designer

**位置：** `C:\Users\user\studio-apartment-designer\`

### 修復項目

#### 1. 門窗放置 Bug
**問題：** 點選牆壁時無法放置門/窗，因為 `handleStageClick` 有一個 guard clause，當點擊到牆壁元素時會提早返回，導致門窗模式永遠觸發不了。

**修復方式（`FloorPlanCanvas.tsx`）：**
- 門窗模式改為**完全繞過** guard clause，無論點到什麼都執行
- 改用 `rawMouseRef` 追蹤未 snap 的真實滑鼠座標，傳入 `findClosestWall()`（原本用 snap 後座標，可能偏離牆壁很遠）
- 偵測半徑從預設值加大至 **60px**
- 新增即時 hover 預覽：橘色牆壁高亮 + 門弧/窗虛線預覽；距離太遠時顯示紅圈提示

#### 2. 平面圖範本不符合台灣租屋現實
**問題：** 原本範本沒有門窗、廁所位置不對、家具擺放不符合邏輯。

**修復方式（`templates.ts`）：** 全部重寫，參考台灣常見租屋格局：
- **10坪小套房**：廁所靠近入口左上角，廚房沿左牆，床靠右邊
- **15坪標準套房**：廁所入口旁，廚房獨立一側，客廳+臥室分區
- **20坪含獨立廚房**：廚房有隔間，空間層次更豐富
- **L型格局套房**：非矩形格局，牆壁形成 L 型空間

所有範本皆有對應的**門窗 Opening 資料**，`position` 值為沿牆長度的 0~1 比例。

### GitHub 上傳
- 初始化 git repo，建立 `.gitignore`，完成首次 commit
- Repo 資訊：`ChengYinWang/studio-apartment-designer`（private）

---

## 專案二：studio-apartment-game（全新建立）

**位置：** `C:\Users\user\studio-apartment-game\`
**啟動指令：** `npm run dev`（port: 5174）

### 技術堆疊

| 工具 | 用途 |
|------|------|
| Vite + React 18 + TypeScript | 建置工具 |
| Tailwind CSS | 深色遊戲風格樣式 |
| Framer Motion | 階段過場動畫 |
| react-konva | Stage 3 簡化平面圖 |
| Zustand v5 | 跨階段全域狀態 |
| @anthropic-ai/sdk | Stage 4 & 5 Claude API 呼叫 |
| uuid | 家具/事件 ID 生成 |

### 專案結構

```
studio-apartment-game/
├── .env                          ← API Key 在這裡設定
├── .env.example
├── vite.config.ts
├── tailwind.config.ts
└── src/
    ├── App.tsx                   ← AnimatePresence 階段路由
    ├── types/index.ts            ← 所有 TypeScript 型別
    ├── data/
    │   ├── dreamItems.ts         ← 6 個夢幻條件
    │   ├── identities.ts         ← 6 個身分卡（含限制/衝突資料）
    │   ├── furniture.ts          ← 家具目錄
    │   └── baseDesign.ts         ← 預建 15坪平面圖
    ├── store/useGameStore.ts     ← 唯一 Zustand store
    ├── services/claudeService.ts ← Claude API 呼叫（Stage 4 & 5）
    ├── components/
    │   ├── StageLayout.tsx       ← 共用深色背景 + 進度條
    │   └── floorplan/            ← Konva 平面圖元件群
    └── stages/
        ├── Stage1_DreamWishlist.tsx
        ├── Stage2_IdentityCard.tsx
        ├── Stage3_Design.tsx
        ├── Stage4_AIAnalysis.tsx
        └── Stage5_DecisionLedger.tsx
```

### 5 個遊戲階段

#### Stage 1：夢幻住宅條件
- 勾選最多 6 項夢幻條件（中島廚房、獨立大浴缸、步入式衣帽間、居家電影院、小型健身區、其他）
- 至少選 1 項才能繼續

#### Stage 2：身分卡選擇
- 6 種微型獨居身分：飼養大型犬、飼養兩貓、輪椅族、設計系學生、室內叢林狂熱者、極端夜貓子
- 每張卡片有：emoji、tagline、3 條空間限制
- 若選擇的身分與夢幻條件衝突，顯示琥珀色警告

#### Stage 3：平面圖設計（純家具擺放）
- 左欄：家具面板（按類別分頁）
- 中欄：Konva 畫布，預載 15坪平面圖底圖，可放置/拖曳/刪除家具
- 右欄：唯讀顯示夢幻條件與身分限制（純參考，無互動）
- 每次家具操作都記錄為 `DesignEvent`，供 AI 分析用

#### Stage 4：AI 決策推論
- 進入時自動呼叫 Claude API
- Claude 根據：夢幻條件 + 身分 + 設計操作日誌 → 生成 4~5 條推論
- 每條推論可選擇：✅ 確認正確 / ✏️ 輸入修正內容
- 全部作答後才能進入下一階段

#### Stage 5：決策分類帳
- 進入時自動呼叫 Claude API（第二次）
- 輸出：核心價值觀前三名、決策模式分析、空間哲學小結
- 底部有「重新挑戰」按鈕，重置全部狀態

### Claude API 提示詞語言
- 繁體中文
- Stage 4：要求 JSON 陣列，每條以「系統觀察到您」開頭
- Stage 5：要求 JSON 物件，包含 values / decisionPattern / spacePhilosophy

---

## 修復過程：解決無法開啟網頁

**問題：** 網站 localhost:5174 無法存取

**根本原因：** `@anthropic-ai/sdk` 在瀏覽器環境下，模組載入時就參照了 Node.js 內建模組（`process`、`global` 等），導致 Vite 打包後在瀏覽器執行失敗。

**修復方式：**

1. `vite.config.ts` 新增 polyfill：
```typescript
define: {
  global: 'globalThis',
  'process.env': '{}',
}
```

2. `claudeService.ts` 改為懶初始化（不在模組頂層建立 client）：
```typescript
// 修復前（模組載入時就執行 → 瀏覽器崩潰）
const client = new Anthropic({ ... })

// 修復後（只在呼叫 API 時才建立）
function getClient() {
  return new Anthropic({ apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY, dangerouslyAllowBrowser: true })
}
```

---

## API Key 設定方式

1. 前往 [https://console.anthropic.com](https://console.anthropic.com) 取得 API Key
2. 編輯 `C:\Users\user\studio-apartment-game\.env`：
```
VITE_ANTHROPIC_API_KEY=sk-ant-api03-你的key
```
3. 重新執行 `npm run dev`
4. 帳戶需有足夠餘額（可在 console.anthropic.com/settings/billing 儲值，最低 $5 USD）

---

## 視覺設計規範

| 元素 | 色碼 |
|------|------|
| 背景 | `#0a0a14`（深藍黑） |
| 主色（過場） | `#7c3aed`（紫） |
| 強調色（警告） | `#f59e0b`（琥珀） |
| 文字 | `#e2e8f0`（淡白） |
| 卡片背景 | `#1a1a2e` + `border: rgba(255,255,255,0.08)` |

---

*本日誌由 Claude Code 自動整理*
