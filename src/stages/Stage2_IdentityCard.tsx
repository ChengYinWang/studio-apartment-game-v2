import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { StageLayout, PageMotion } from '../components/StageLayout'
import { useGameStore } from '../store/useGameStore'
import { identities } from '../data/identities'
import { dreamItems } from '../data/dreamItems'
import type { Identity } from '../types'

export function Stage2_IdentityCard() {
  const { selectedIdentity, setIdentity, goToStage, selectedDreams } = useGameStore()
  const [hovered, setHovered] = useState<string | null>(null)

  const handleSelect = (identity: Identity) => {
    setIdentity(identity)
  }

  const handleConfirm = () => {
    if (selectedIdentity) goToStage(3)
  }

  const conflictingDreams = selectedIdentity
    ? selectedIdentity.forbiddenDreams
        .filter((id) => selectedDreams.includes(id))
        .map((id) => dreamItems.find((d) => d.id === id)?.label)
        .filter(Boolean)
    : []

  return (
    <StageLayout stage={2}>
      <PageMotion>
        <div className="max-w-4xl mx-auto px-6 py-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="text-center mb-10"
          >
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl font-extrabold text-amber-400 mb-2"
            >
              現實來了。
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/50 text-base"
            >
              選擇你的微型獨居身分，然後用 15 平方公尺完成你的夢幻清單。
            </motion.p>
          </motion.div>

          {/* Identity cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {identities.map((identity, i) => {
              const isSelected = selectedIdentity?.id === identity.id
              const isHovered = hovered === identity.id
              return (
                <motion.button
                  key={identity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  onClick={() => handleSelect(identity)}
                  onMouseEnter={() => setHovered(identity.id)}
                  onMouseLeave={() => setHovered(null)}
                  className={`relative flex flex-col p-5 rounded-2xl border text-left transition-all duration-200 ${
                    isSelected
                      ? 'bg-amber-900/30 border-amber-500 shadow-lg shadow-amber-500/20'
                      : 'bg-[#1a1a2e] border-white/8 hover:border-white/25 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{identity.emoji}</span>
                    <div>
                      <div className={`font-bold text-sm ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                        {identity.label}
                      </div>
                      <div className="text-xs text-white/35 mt-0.5">{identity.tagline}</div>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {identity.constraints.map((c, ci) => (
                      <li key={ci} className="flex items-start gap-2 text-xs text-white/50">
                        <span className="text-amber-500/70 mt-0.5 flex-shrink-0">▸</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                      <svg viewBox="0 0 20 20" fill="white" className="w-3 h-3">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Conflict warning */}
          <AnimatePresence>
            {conflictingDreams.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-sm text-amber-300"
              >
                ⚠️ 注意：你的夢幻清單中，
                <strong>「{conflictingDreams.join('」、「')}」</strong>
                與此身分有較高衝突——但你仍然可以嘗試！
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confirm button */}
          <div className="flex justify-center">
            <motion.button
              onClick={handleConfirm}
              disabled={!selectedIdentity}
              whileHover={selectedIdentity ? { scale: 1.03 } : {}}
              whileTap={selectedIdentity ? { scale: 0.97 } : {}}
              className={`px-10 py-4 rounded-2xl text-base font-bold transition-all ${
                selectedIdentity
                  ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/30 cursor-pointer'
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
            >
              {selectedIdentity
                ? `以「${selectedIdentity.label}」身分接受挑戰 →`
                : '請選擇一種身分'}
            </motion.button>
          </div>
        </div>
      </PageMotion>
    </StageLayout>
  )
}
