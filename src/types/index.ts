export type Point = { x: number; y: number }

export interface Wall { id: string; start: Point; end: Point; thickness: number }
export interface Opening { id: string; wallId: string; type: 'door' | 'window'; position: number; width: number }
export interface FurnitureItem {
  id: string; catalogId: string
  x: number; y: number; width: number; height: number
  rotation: number; label: string; color: string
}

export interface FurnitureCatalogItem {
  id: string; label: string
  category: '臥室' | '客廳' | '廚房' | '衛浴' | '收納' | '特殊'
  defaultWidth: number; defaultHeight: number
  color: string; icon: string
}

export interface DreamItem {
  id: string; label: string; icon: string; description: string
  isCustom?: boolean
}

export interface Identity {
  id: string; label: string; emoji: string; tagline: string
  constraints: string[]
  requiredFurniture: string[]   // catalogId hints
  forbiddenDreams: string[]     // dreamItem ids that conflict
}

export interface DesignEvent {
  timestamp: number
  type: 'add' | 'remove' | 'move'
  furnitureLabel: string
  catalogId: string
}

export interface Inference {
  id: string
  text: string
  confirmed: boolean | null
  userCorrection?: string
}

export interface DecisionLedgerData {
  values: { rank: number; label: string; reason: string }[]
  decisionPattern: string
  spacePhilosophy: string
}
