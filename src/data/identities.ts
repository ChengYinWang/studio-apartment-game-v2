import type { Identity } from '../types'

export const identities: Identity[] = [
  {
    id: 'dog-owner',
    label: '飼養大型犬',
    emoji: '🐕',
    tagline: '牠需要奔跑，你需要後悔',
    constraints: [
      '玄關需設置狗籠或寵物休憩區（至少 80×100cm）',
      '走廊與迴轉空間不得低於 90cm，避免障礙物',
      '地板材質需防滑、耐抓，無地毯',
    ],
    requiredFurniture: ['shoe-cabinet'],
    forbiddenDreams: ['walk-in-wardrobe', 'home-theater'],
  },
  {
    id: 'cat-owner',
    label: '飼養兩貓',
    emoji: '🐈',
    tagline: '貓佔沙發，你睡地板',
    constraints: [
      '需配置貓跳台（垂直活動空間 150cm 以上）',
      '砂盆區域需獨立通風角落，遠離廚房與臥床',
      '所有家具須考慮耐抓材質，避免珍貴木料',
    ],
    requiredFurniture: ['bookshelf'],
    forbiddenDreams: ['walk-in-wardrobe', 'freestanding-bath'],
  },
  {
    id: 'wheelchair',
    label: '輪椅族',
    emoji: '♿',
    tagline: '空間就是自由',
    constraints: [
      '所有走道寬度至少 90cm，門口淨寬 80cm 以上',
      '衛浴需無障礙設計：扶手、淋浴座椅、低門檻',
      '迴轉半徑需預留 150cm 的空白地板空間',
    ],
    requiredFurniture: ['sink', 'toilet'],
    forbiddenDreams: ['walk-in-wardrobe', 'mini-gym'],
  },
  {
    id: 'design-student',
    label: '設計系學生',
    emoji: '📐',
    tagline: '模型堆到床上，生活才叫完整',
    constraints: [
      '需要至少 140cm 寬的大型工作桌，含圖板展開空間',
      '需要大量垂直收納：圖板架、模型展示、作品集書架',
      '強烈建議設置展示牆或留白牆面貼圖稿',
    ],
    requiredFurniture: ['desk', 'bookshelf'],
    forbiddenDreams: ['home-theater', 'mini-gym'],
  },
  {
    id: 'plant-lover',
    label: '室內叢林狂熱者',
    emoji: '🌿',
    tagline: '植物比傢俱重要',
    constraints: [
      '採光需求高：窗邊必須留出大面積植物排列空間',
      '需設置植物架或掛鉤系統，牆面不可全部封閉',
      '地板需防水、耐濕，澆水動線需順暢',
    ],
    requiredFurniture: ['bookshelf'],
    forbiddenDreams: ['home-theater', 'island-kitchen'],
  },
  {
    id: 'night-owl',
    label: '極端夜貓子',
    emoji: '🦉',
    tagline: '3AM 才是你的早晨',
    constraints: [
      '窗戶需能完全遮光，臥睡區與外窗之間要有緩衝',
      '夜間活動區（書桌、電腦）需與臥床區有明確分隔',
      '需考慮隔音：音樂、鍵盤聲不可影響鄰居',
    ],
    requiredFurniture: ['desk', 'tv-cabinet'],
    forbiddenDreams: ['mini-gym', 'island-kitchen'],
  },
]
