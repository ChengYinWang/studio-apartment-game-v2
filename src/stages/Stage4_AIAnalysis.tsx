import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StageLayout, PageMotion } from '../components/StageLayout'
import { useGameStore } from '../store/useGameStore'
import { generateInferences } from '../services/claudeService'

export function Stage4_AIAnalysis() {
  const {
    selectedIdentity,
    selectedDreams,
    customDream,
    designEvents,
    furniture,
    inferences,
    isAnalyzing,
    setInferences,
    setIsAnalyzing,
    confirmInference,
    goToStage,
  } = useGameStore()

  const [corrections, setCorrections] = useState<Record<string, string>>({})
  const [openCorrection, setOpenCorrection] = useState<string | null>(null)

  useEffect(() => {
    if (inferences.length > 0 || isAnalyzing || !selectedIdentity) return
    setIsAnalyzing(true)
    generateInferences({
      identity: selectedIdentity,
      selectedDreams,
      customDream,
      designEvents,
      finalFurniture: furniture,
    })
      .then(setInferences)
      .catch((err) => {
        console.error(err)
        const msg = err?.message ?? err?.toString() ?? '未知錯誤'
        setInferences([{
          id: '0',
          text: `AI 分析時發生錯誤：${msg}`,
          confirmed: null,
        }])
      })
      .finally(() => setIsAnalyzing(false))
  }, [])

  const allAnswered = inferences.length > 0 && inferences.every((i) => i.confirmed !== null)

  const handleConfirm = (id: string) => confirmInference(id, true)
  const handleCorrect = (id: string) => {
    const correction = corrections[id] ?? ''
    if (correction.trim()) {
      confirmInference(id, false, correction.trim())
      setOpenCorrection(null)
    }
  }

  return (
    <StageLayout stage={4}>
      <PageMotion>
        <div className="max-w-2xl mx-auto px-6 py-10">
          {/* Header */}
          <motion.div className="text-center mb-10">
            <div className="text-4xl mb-3">🔍</div>
            <h1 className="text-2xl font-extrabold text-white mb-2">AI 決策推論</h1>
            <p className="text-white/40 text-sm">
              系統分析了你的設計過程，以下是觀察到的決策模式。
            </p>
          </motion.div>

          {/* Loading state */}
          {isAnalyzing && (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 rounded-2xl bg-white/5 shimmer" />
              ))}
              <p className="text-center text-xs text-white/30 mt-4 animate-pulse">
                AI 正在分析你的空間決策…
              </p>
            </div>
          )}

          {/* Inference cards */}
          {!isAnalyzing && (
            <AnimatePresence>
              <div className="space-y-4">
                {inferences.map((inf, i) => {
                  const isDone = inf.confirmed !== null
                  const isCorrection = inf.confirmed === false
                  const isOpenInput = openCorrection === inf.id
                  return (
                    <motion.div
                      key={inf.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`rounded-2xl border p-5 transition-all ${
                        isDone
                          ? isCorrection
                            ? 'bg-amber-950/30 border-amber-600/40'
                            : 'bg-violet-950/30 border-violet-600/40'
                          : 'bg-[#1a1a2e] border-white/8'
                      }`}
                    >
                      <p className="text-sm text-white/80 leading-relaxed mb-4">{inf.text}</p>

                      {!isDone ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => handleConfirm(inf.id)}
                            className="w-full py-2 text-xs font-semibold rounded-xl bg-violet-800/50 hover:bg-violet-700/60 text-violet-200 transition-colors"
                          >
                            ✅ 沒錯，推論正確
                          </button>
                          {!isOpenInput ? (
                            <button
                              onClick={() => setOpenCorrection(inf.id)}
                              className="w-full py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-white/50 transition-colors"
                            >
                              ✏️ 不，其實是因為…
                            </button>
                          ) : (
                            <div className="space-y-2">
                              <textarea
                                value={corrections[inf.id] ?? ''}
                                onChange={(e) => setCorrections((prev) => ({ ...prev, [inf.id]: e.target.value }))}
                                placeholder="說說你真正的想法…"
                                rows={2}
                                autoFocus
                                className="w-full bg-white/5 rounded-xl px-3 py-2 text-sm text-white/70 placeholder-white/20 outline-none border border-white/10 focus:border-amber-500 resize-none transition-colors"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleCorrect(inf.id)}
                                  disabled={!(corrections[inf.id] ?? '').trim()}
                                  className="flex-1 py-1.5 text-xs font-semibold rounded-xl bg-amber-600/60 hover:bg-amber-500/70 text-amber-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                  送出修正
                                </button>
                                <button
                                  onClick={() => setOpenCorrection(null)}
                                  className="px-3 py-1.5 text-xs rounded-xl bg-white/5 text-white/40 hover:bg-white/10 transition-colors"
                                >
                                  取消
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs">
                          {isCorrection ? (
                            <span className="text-amber-400">✏️ 你的修正：{inf.userCorrection}</span>
                          ) : (
                            <span className="text-violet-400">✅ 已確認</span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </AnimatePresence>
          )}

          {/* Proceed button */}
          {allAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex justify-center"
            >
              <motion.button
                onClick={() => goToStage(5)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-10 py-4 bg-violet-600 hover:bg-violet-500 text-white text-base font-bold rounded-2xl shadow-lg shadow-violet-500/30"
              >
                生成決策分類帳 →
              </motion.button>
            </motion.div>
          )}
        </div>
      </PageMotion>
    </StageLayout>
  )
}
