import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { Identity, FurnitureItem, DesignEvent, Inference, DecisionLedgerData } from '../types'
import { makeDefaultFurniture, DEFAULT_BATH_DIV_X, DEFAULT_BATH_DIV_Y } from '../data/baseDesign'

interface GameStore {
  stage: number

  // Stage 1
  selectedDreams: string[]
  customDream: string

  // Stage 2
  selectedIdentity: Identity | null

  // Stage 3
  furniture: FurnitureItem[]
  designEvents: DesignEvent[]
  pendingCatalogId: string | null  // catalogId waiting to be placed
  bathDivX: number
  bathDivY: number

  // Stage 4
  inferences: Inference[]
  isAnalyzing: boolean

  // Stage 5
  ledgerData: DecisionLedgerData | null
  isGeneratingLedger: boolean

  // Actions – navigation
  goToStage: (s: number) => void
  resetGame: () => void

  // Stage 1
  toggleDream: (id: string) => void
  setCustomDream: (s: string) => void

  // Stage 2
  setIdentity: (identity: Identity) => void

  // Stage 3
  setPendingCatalogId: (id: string | null) => void
  addFurniture: (item: Omit<FurnitureItem, 'id'>) => void
  moveFurniture: (id: string, x: number, y: number) => void
  removeFurniture: (id: string) => void
  setBathDiv: (x: number, y: number) => void

  // Stage 4
  setInferences: (inferences: Inference[]) => void
  setIsAnalyzing: (v: boolean) => void
  rateInference: (id: string, rating: number, correction?: string) => void

  // Stage 5
  setLedgerData: (data: DecisionLedgerData) => void
  setIsGeneratingLedger: (v: boolean) => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  stage: 1,

  selectedDreams: [],
  customDream: '',

  selectedIdentity: null,

  furniture: makeDefaultFurniture(),
  designEvents: [],
  pendingCatalogId: null,
  bathDivX: DEFAULT_BATH_DIV_X,
  bathDivY: DEFAULT_BATH_DIV_Y,

  inferences: [],
  isAnalyzing: false,

  ledgerData: null,
  isGeneratingLedger: false,

  goToStage: (s) => set({ stage: s }),

  resetGame: () => set({
    stage: 1,
    selectedDreams: [],
    customDream: '',
    selectedIdentity: null,
    furniture: makeDefaultFurniture(),
    designEvents: [],
    pendingCatalogId: null,
    bathDivX: DEFAULT_BATH_DIV_X,
    bathDivY: DEFAULT_BATH_DIV_Y,
    inferences: [],
    isAnalyzing: false,
    ledgerData: null,
    isGeneratingLedger: false,
  }),


  toggleDream: (id) => set((state) => ({
    selectedDreams: state.selectedDreams.includes(id)
      ? state.selectedDreams.filter((d) => d !== id)
      : [...state.selectedDreams, id],
  })),

  setCustomDream: (s) => set({ customDream: s }),

  setIdentity: (identity) => set({ selectedIdentity: identity }),

  setPendingCatalogId: (id) => set({ pendingCatalogId: id }),

  addFurniture: (item) => {
    const newItem = { ...item, id: uuidv4() }
    set((state) => ({
      furniture: [...state.furniture, newItem],
      designEvents: [...state.designEvents, {
        timestamp: Date.now(),
        type: 'add' as const,
        furnitureLabel: item.label,
        catalogId: item.catalogId,
      }],
      pendingCatalogId: null,
    }))
  },

  moveFurniture: (id, x, y) => {
    const item = get().furniture.find((f) => f.id === id)
    if (!item) return
    set((state) => ({
      furniture: state.furniture.map((f) => f.id === id ? { ...f, x, y } : f),
      designEvents: [...state.designEvents, {
        timestamp: Date.now(),
        type: 'move' as const,
        furnitureLabel: item.label,
        catalogId: item.catalogId,
      }],
    }))
  },

  removeFurniture: (id) => {
    const item = get().furniture.find((f) => f.id === id)
    if (!item) return
    set((state) => ({
      furniture: state.furniture.filter((f) => f.id !== id),
      designEvents: [...state.designEvents, {
        timestamp: Date.now(),
        type: 'remove' as const,
        furnitureLabel: item.label,
        catalogId: item.catalogId,
      }],
    }))
  },

  setBathDiv: (x, y) => set({ bathDivX: x, bathDivY: y }),

  setInferences: (inferences) => set({ inferences }),
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),

  rateInference: (id, rating, correction) =>
    set((state) => ({
      inferences: state.inferences.map((inf) =>
        inf.id === id ? { ...inf, rating, userCorrection: correction } : inf
      ),
    })),

  setLedgerData: (data) => set({ ledgerData: data }),
  setIsGeneratingLedger: (v) => set({ isGeneratingLedger: v }),
}))
