import { motion } from 'framer-motion'
import { useState } from 'react'
import { StageLayout, PageMotion } from '../components/StageLayout'
import { useGameStore } from '../store/useGameStore'
import { dreamItems } from '../data/dreamItems'

export function Stage1_DreamWishlist() {
  const { selectedDreams, customDream, toggleDream, setCustomDream, goToStage } = useGameStore()
  const canProceed = selectedDreams.length > 0

  const handleNext = () => {
    if (canProceed) goToStage(2)
  }

  return (
    <StageLayout stage={1}>
      <PageMotion>
        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <div className="text-5xl mb-4 float">🏠</div>
            <h1 className="text-3xl font-extrabold text-white mb-3">
              如果坪數不是問題
            </h1>
            <p className="text-lg text-white/50">
              你的夢幻家，有哪些你一定要有的？
            </p>
          </motion.div>

          {/* Dream items grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {dreamItems.map((item, i) => {
              if (item.isCustom) return null
              const isSelected = selectedDreams.includes(item.id)
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                  onClick={() => toggleDream(item.id)}
                  className={`relative flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-200 ${
                    isSelected
                      ? 'bg-violet-900/40 border-violet-500 shadow-lg shadow-violet-500/20'
                      : 'bg-[#1a1a2e] border-white/8 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <span className="text-3xl mt-0.5">{item.icon}</span>
                  <div className="flex-1">
                    <div className={`font-bold text-base mb-1 ${isSelected ? 'text-violet-200' : 'text-white'}`}>
                      {item.label}
                    </div>
                    <div className="text-xs text-white/40">{item.description}</div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all ${
                      isSelected
                        ? 'bg-violet-500 border-violet-500'
                        : 'border-white/20'
                    }`}
                  >
                    {isSelected && (
                      <svg viewBox="0 0 20 20" fill="white" className="w-full h-full p-0.5">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </div>
                </motion.button>
              )
            })}

            {/* 其他 card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + 5 * 0.07 }}
              className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 ${
                customDream.trim()
                  ? 'bg-violet-900/40 border-violet-500'
                  : 'bg-[#1a1a2e] border-white/8'
              }`}
            >
              <span className="text-3xl mt-0.5">✨</span>
              <div className="flex-1">
                <div className="font-bold text-base text-white mb-2">其他</div>
                <textarea
                  value={customDream}
                  onChange={(e) => setCustomDream(e.target.value)}
                  placeholder="還有什麼夢幻需求？（選填）"
                  rows={2}
                  className="w-full bg-transparent text-sm text-white/70 placeholder-white/20 resize-none outline-none border-b border-white/10 focus:border-violet-500 transition-colors pb-1"
                />
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col items-center gap-3"
          >
            {selectedDreams.length > 0 && (
              <p className="text-sm text-violet-400">
                已選擇 {selectedDreams.length} 項夢幻條件
              </p>
            )}
            <motion.button
              onClick={handleNext}
              disabled={!canProceed}
              whileHover={canProceed ? { scale: 1.03 } : {}}
              whileTap={canProceed ? { scale: 0.97 } : {}}
              className={`px-10 py-4 rounded-2xl text-base font-bold transition-all ${
                canProceed
                  ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/30 cursor-pointer'
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
            >
              確認我的夢幻宅 →
            </motion.button>
            {!canProceed && (
              <p className="text-xs text-white/30">請至少勾選一項</p>
            )}
          </motion.div>
        </div>
      </PageMotion>
    </StageLayout>
  )
}
