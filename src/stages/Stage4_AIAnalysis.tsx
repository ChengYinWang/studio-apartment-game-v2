import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StageLayout, PageMotion } from '../components/StageLayout'
import { useGameStore } from '../store/useGameStore'
import { generateInferences } from '../services/claudeService'

const STAR_LABELS = ['', '偏差', '部分準確', '大致正確', '相當準確', '完全命中']

function StarRating({
  value,
  onChange,
}: {
  value: number | null
  onChange: (v: number) => void
}) {
  const [hovered, setHovered] = useState<number | null>(null)
  const active = hovered ?? value ?? 0

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(n)}
          className="text-xl leading-none transition-transform hover:scale-110"
          title={STAR_LABELS[n]}
        >
          <span className={n <= active ? 'text-amber-400' : 'text-white/20'}>★</span>
        </button>
      ))}
      {active > 0 && (
        <span className="ml-1.5 text-xs text-white/40">{STAR_LABELS[active]}</span>
      )}
    </div>
  )
}

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
    rateInference,
    goToStage,
  } = useGameStore()

  const [corrections, setCorrections] = useState<Record<string, string>>({})

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
        setInferences([{ id: '0', text: `AI 分析時發生錯誤：${msg}`, rating: null }])
      })
      .finally(() => setIsAnalyzing(false))
  }, [])

  const allRated = inferences.length > 0 && inferences.every((i) => i.rating !== null)

  const handleRate = (id: string, rating: number) => {
    const correction = corrections[id]?.trim() || undefined
    rateInference(id, rating, correction)
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
              系統分析了你的設計過程。請為每條推論的精準度打分（必填）。
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
                  const isRated = inf.rating !== null
                  const ratingColor =
                    (inf.rating ?? 0) >= 4
                      ? 'bg-violet-950/30 border-violet-600/40'
                      : (inf.rating ?? 0) >= 3
                      ? 'bg-blue-950/30 border-blue-600/40'
                      : 'bg-amber-950/30 border-amber-600/40'

                  return (
                    <motion.div
                      key={inf.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`rounded-2xl border p-5 transition-all ${
                        isRated ? ratingColor : 'bg-[#1a1a2e] border-white/8'
                      }`}
                    >
                      <p className="text-sm text-white/85 leading-relaxed mb-4">{inf.text}</p>

                      {/* Star rating */}
                      <div className="mb-3">
                        <p className="text-xs text-white/30 mb-1.5">推論精準度</p>
                        <StarRating
                          value={inf.rating}
                          onChange={(rating) => handleRate(inf.id, rating)}
                        />
                      </div>

                      {/* Optional correction */}
                      <div>
                        <textarea
                          value={corrections[inf.id] ?? ''}
                          onChange={(e) => {
                            const val = e.target.value
                            setCorrections((prev) => ({ ...prev, [inf.id]: val }))
                            // 如果已評分且有文字，即時更新修正
                            if (inf.rating !== null) {
                              rateInference(inf.id, inf.rating, val.trim() || undefined)
                            }
                          }}
                          placeholder="（可選）我實際上覺得…"
                          rows={1}
                          className="w-full bg-white/5 rounded-xl px-3 py-2 text-xs text-white/60 placeholder-white/20 outline-none border border-white/8 focus:border-white/25 resize-none transition-colors"
                        />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </AnimatePresence>
          )}

          {/* Proceed button */}
          {allRated && (
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
