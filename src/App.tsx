import { AnimatePresence } from 'framer-motion'
import { useGameStore } from './store/useGameStore'
import { Stage1_DreamWishlist } from './stages/Stage1_DreamWishlist'
import { Stage2_IdentityCard } from './stages/Stage2_IdentityCard'
import { Stage3_Design } from './stages/Stage3_Design'
import { Stage4_AIAnalysis } from './stages/Stage4_AIAnalysis'
import { Stage5_DecisionLedger } from './stages/Stage5_DecisionLedger'

export default function App() {
  const stage = useGameStore((s) => s.stage)

  return (
    <AnimatePresence mode="wait">
      {stage === 1 && <Stage1_DreamWishlist key="s1" />}
      {stage === 2 && <Stage2_IdentityCard key="s2" />}
      {stage === 3 && <Stage3_Design key="s3" />}
      {stage === 4 && <Stage4_AIAnalysis key="s4" />}
      {stage === 5 && <Stage5_DecisionLedger key="s5" />}
    </AnimatePresence>
  )
}
