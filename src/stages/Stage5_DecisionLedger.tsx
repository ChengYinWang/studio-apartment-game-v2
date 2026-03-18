import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { StageLayout, PageMotion } from '../components/StageLayout'
import { useGameStore } from '../store/useGameStore'
import { generateLedger } from '../services/claudeService'

const RANK_COLORS = ['#f59e0b', '#94a3b8', '#d97706']
const RANK_LABELS = ['第一名', '第二名', '第三名']

export function Stage5_DecisionLedger() {
  const {
    selectedIdentity,
    selectedDreams,
    customDream,
    inferences,
    ledgerData,
    isGeneratingLedger,
    setLedgerData,
    setIsGeneratingLedger,
    resetGame,
  } = useGameStore()

  useEffect(() => {
    if (ledgerData || isGeneratingLedger || !selectedIdentity) return
    setIsGeneratingLedger(true)
    generateLedger({ identity: selectedIdentity, selectedDreams, customDream, inferences })
      .then(setLedgerData)
      .catch((err) => {
        console.error(err)
        setLedgerData({
          values: [
            { rank: 1, label: '錯誤', reason: '請確認 API Key 後重試。' },
          ],
          decisionPattern: '無法生成分析。',
          spacePhilosophy: '無法生成分析。',
        })
      })
      .finally(() => setIsGeneratingLedger(false))
  }, [])

  return (
    <StageLayout stage={5}>
      <PageMotion>
        <div className="max-w-2xl mx-auto px-6 py-10">
          {/* Header */}
          <motion.div className="text-center mb-10">
            <div className="text-4xl mb-3">📜</div>
            <h1 className="text-2xl font-extrabold text-white mb-2">決策分類帳</h1>
            <p className="text-white/40 text-sm">
              根據你的設計歷程與推論回饋，AI 揭示你的空間價值觀排序。
            </p>
          </motion.div>

          {/* Loading */}
          {isGeneratingLedger && (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 rounded-2xl bg-white/5 shimmer" />
              ))}
              <p className="text-center text-xs text-white/30 mt-4 animate-pulse">
                AI 正在撰寫你的決策分類帳…
              </p>
            </div>
          )}

          {/* Ledger content */}
          {ledgerData && !isGeneratingLedger && (
            <div className="space-y-6">
              {/* Values ranking */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1a1a2e] rounded-2xl border border-white/8 p-6"
              >
                <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
                  核心價值觀排序
                </h2>
                <div className="space-y-4">
                  {ledgerData.values.map((v, i) => (
                    <motion.div
                      key={v.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.15 }}
                      className="flex items-start gap-4"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                        style={{ backgroundColor: RANK_COLORS[i] + '22', color: RANK_COLORS[i] }}
                      >
                        #{v.rank}
                      </div>
                      <div>
                        <div className="font-bold text-white text-base">{v.label}</div>
                        <div className="text-sm text-white/45 mt-0.5">{v.reason}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Decision pattern */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#1a1a2e] rounded-2xl border border-white/8 p-6"
              >
                <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
                  決策模式分析
                </h2>
                <p className="text-sm text-white/70 leading-relaxed">{ledgerData.decisionPattern}</p>
              </motion.section>

              {/* Space philosophy */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="relative rounded-2xl border border-amber-500/20 p-6 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1a1208 0%, #1a1a2e 100%)' }}
              >
                <div className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b 0, #f59e0b 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px' }}
                />
                <h2 className="text-xs font-bold text-amber-500/60 uppercase tracking-widest mb-3">
                  空間哲學小結
                </h2>
                <p className="text-sm text-amber-200/80 leading-relaxed italic">{ledgerData.spacePhilosophy}</p>
              </motion.section>

              {/* Identity badge */}
              {selectedIdentity && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/3 border border-white/5 text-sm text-white/40"
                >
                  <span className="text-xl">{selectedIdentity.emoji}</span>
                  <span>以「<strong className="text-white/60">{selectedIdentity.label}</strong>」身分完成 15 坪挑戰</span>
                </motion.div>
              )}

              {/* Restart */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex justify-center pt-2"
              >
                <motion.button
                  onClick={resetGame}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3 rounded-2xl text-sm font-bold bg-white/8 hover:bg-white/12 text-white/60 hover:text-white transition-all border border-white/10"
                >
                  🔄 重新挑戰
                </motion.button>
              </motion.div>
            </div>
          )}
        </div>
      </PageMotion>
    </StageLayout>
  )
}
