import { useState } from 'react'
import { motion } from 'framer-motion'
import { StageLayout, PageMotion } from '../components/StageLayout'
import { GameFloorPlan } from '../components/floorplan/GameFloorPlan'
import { useGameStore } from '../store/useGameStore'
import { furnitureCatalog } from '../data/furniture'
import { dreamItems } from '../data/dreamItems'
import type { FurnitureCatalogItem } from '../types'

const CATEGORIES = ['全部', '臥室', '客廳', '廚房', '衛浴', '收納', '特殊'] as const

export function Stage3_Design() {
  const {
    selectedIdentity,
    selectedDreams,
    customDream,
    furniture,
    pendingCatalogId,
    setPendingCatalogId,
    removeFurniture,
    goToStage,
  } = useGameStore()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('全部')

  const filtered = activeCategory === '全部'
    ? furnitureCatalog
    : furnitureCatalog.filter((c) => c.category === activeCategory)

  const handleFurnitureClick = (item: FurnitureCatalogItem) => {
    setPendingCatalogId(pendingCatalogId === item.id ? null : item.id)
    setSelectedId(null)
  }

  const handleDeleteSelected = () => {
    if (selectedId) {
      removeFurniture(selectedId)
      setSelectedId(null)
    }
  }

  const dreamLabels = selectedDreams
    .map((id) => dreamItems.find((d) => d.id === id))
    .filter(Boolean)

  return (
    <StageLayout stage={3} fullCanvas>
      <div className="flex flex-1 overflow-hidden h-full">
        {/* Left: Furniture palette */}
        <aside className="w-48 flex-shrink-0 bg-[#111120] border-r border-white/5 flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b border-white/5">
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider">家具清單</p>
          </div>
          {/* Category tabs */}
          <div className="flex flex-wrap gap-1 p-2 border-b border-white/5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                  activeCategory === cat
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Furniture items */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filtered.map((item) => {
              const isPending = pendingCatalogId === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleFurnitureClick(item)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all ${
                    isPending
                      ? 'bg-violet-700 text-white'
                      : 'hover:bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded text-sm flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: item.color + '88' }}
                  >
                    {item.icon}
                  </span>
                  <span className="text-xs truncate">{item.label}</span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Center: Canvas */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Mini toolbar */}
          <div className="flex items-center gap-3 px-4 py-2 border-b border-white/5 bg-[#0d0d1e] flex-shrink-0">
            <span className="text-xs text-white/30">
              {pendingCatalogId
                ? `正在放置「${furnitureCatalog.find((c) => c.id === pendingCatalogId)?.label}」— 點擊畫布放置 · ESC 取消`
                : selectedId
                ? '已選取家具 — 拖曳移動 · Delete 刪除'
                : '點擊家具選取 · 從左側選擇家具放置'}
            </span>
            <div className="flex-1" />
            {selectedId && (
              <button
                onClick={handleDeleteSelected}
                className="text-xs px-3 py-1 bg-red-900/40 hover:bg-red-800/50 text-red-300 rounded-lg transition-colors"
              >
                🗑️ 刪除
              </button>
            )}
            <motion.button
              onClick={() => goToStage(4)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-lg transition-colors"
            >
              完成設計，送 AI 分析 →
            </motion.button>
          </div>
          <div className="flex-1 overflow-hidden p-3">
            <GameFloorPlan selectedId={selectedId} onSelect={setSelectedId} />
          </div>
        </main>

        {/* Right: Conditions reference */}
        <aside className="w-56 flex-shrink-0 bg-[#111120] border-l border-white/5 overflow-y-auto">
          <div className="p-3 space-y-5">
            {/* Dream items */}
            <div>
              <p className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2">🌟 夢幻宅清單</p>
              <ul className="space-y-1.5">
                {dreamLabels.map((item) => item && (
                  <li key={item.id} className="flex items-start gap-2 text-xs text-white/50">
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span>{item.label}</span>
                  </li>
                ))}
                {customDream && (
                  <li className="flex items-start gap-2 text-xs text-white/50">
                    <span className="flex-shrink-0">✨</span>
                    <span>{customDream}</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="h-px bg-white/5" />

            {/* Identity constraints */}
            {selectedIdentity && (
              <div>
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  {selectedIdentity.emoji} 身分限制
                </p>
                <p className="text-xs text-amber-300/70 font-semibold mb-2">{selectedIdentity.label}</p>
                <ul className="space-y-2">
                  {selectedIdentity.constraints.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/45 leading-relaxed">
                      <span className="text-amber-500/50 mt-0.5 flex-shrink-0">▸</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="h-px bg-white/5" />

            {/* Current furniture count */}
            <div>
              <p className="text-xs font-bold text-white/30 uppercase tracking-wider mb-2">📦 已放置</p>
              <p className="text-sm font-bold text-white">{furniture.length} 件家具</p>
            </div>
          </div>
        </aside>
      </div>
    </StageLayout>
  )
}
