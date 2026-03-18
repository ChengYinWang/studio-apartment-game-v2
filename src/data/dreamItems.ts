import type { DreamItem } from '../types'

export const dreamItems: DreamItem[] = [
  {
    id: 'island-kitchen',
    label: '中島廚房',
    icon: '🏝️',
    description: '需額外 2–3 坪開放空間',
  },
  {
    id: 'freestanding-bath',
    label: '獨立大浴缸',
    icon: '🛁',
    description: '衛浴至少 2.5 坪才容納得下',
  },
  {
    id: 'walk-in-wardrobe',
    label: '步入式衣帽間',
    icon: '👗',
    description: '獨立空間至少需要 1.5 坪',
  },
  {
    id: 'home-theater',
    label: '居家電影院',
    icon: '🎬',
    description: '投影牆 + 沙發區佔用 3–4 坪',
  },
  {
    id: 'mini-gym',
    label: '小型健身區',
    icon: '💪',
    description: '瑜伽墊 + 器材至少需要 2 坪',
  },
  {
    id: 'custom',
    label: '其他',
    icon: '✨',
    description: '說說你還想要什麼？',
    isCustom: true,
  },
]
