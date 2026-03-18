import { motion } from 'framer-motion'

const STAGE_LABELS = ['夢幻清單', '選擇身分', '空間設計', 'AI 分析', '決策帳本']

interface Props {
  stage: number
  children: React.ReactNode
  fullCanvas?: boolean
}

export function StageLayout({ stage, children, fullCanvas }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0a14] text-[#e2e8f0] flex flex-col">
      {/* Progress bar */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-white/5 flex-shrink-0">
        {STAGE_LABELS.map((label, i) => {
          const n = i + 1
          const isActive = n === stage
          const isDone = n < stage
          return (
            <div key={n} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                    : isDone
                    ? 'bg-violet-900 text-violet-300'
                    : 'bg-white/5 text-white/30'
                }`}
              >
                {isDone ? '✓' : n}
              </div>
              <span
                className={`text-xs hidden sm:inline transition-colors ${
                  isActive ? 'text-violet-300 font-semibold' : isDone ? 'text-violet-500' : 'text-white/20'
                }`}
              >
                {label}
              </span>
              {i < STAGE_LABELS.length - 1 && (
                <div className={`w-8 h-px ${isDone ? 'bg-violet-700' : 'bg-white/10'} mx-1 hidden sm:block`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Content */}
      <div className={`flex-1 ${fullCanvas ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`}>
        {children}
      </div>
    </div>
  )
}

export const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.3, ease: 'easeIn' } },
}

export function PageMotion({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full h-full"
    >
      {children}
    </motion.div>
  )
}
