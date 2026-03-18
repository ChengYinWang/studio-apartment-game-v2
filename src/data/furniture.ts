import type { FurnitureCatalogItem } from '../types'

export const furnitureCatalog: FurnitureCatalogItem[] = [
  // 臥室
  { id: 'single-bed',   label: '單人床',   category: '臥室', defaultWidth: 100, defaultHeight: 200, color: '#a8d5e2', icon: '🛏️' },
  { id: 'double-bed',   label: '雙人床',   category: '臥室', defaultWidth: 160, defaultHeight: 200, color: '#7ec8e3', icon: '🛏️' },
  { id: 'wardrobe',     label: '衣櫃',     category: '臥室', defaultWidth: 120, defaultHeight: 60,  color: '#d4a76a', icon: '🪞' },
  { id: 'dresser',      label: '梳妝台',   category: '臥室', defaultWidth: 80,  defaultHeight: 40,  color: '#e8c99a', icon: '🪞' },
  { id: 'desk',         label: '書桌',     category: '臥室', defaultWidth: 140, defaultHeight: 65,  color: '#c8b99a', icon: '🖥️' },
  // 客廳
  { id: 'sofa',         label: '沙發',     category: '客廳', defaultWidth: 200, defaultHeight: 90,  color: '#9eb3c2', icon: '🛋️' },
  { id: 'coffee-table', label: '茶几',     category: '客廳', defaultWidth: 100, defaultHeight: 60,  color: '#c4a882', icon: '🪑' },
  { id: 'tv-cabinet',   label: '電視櫃',   category: '客廳', defaultWidth: 160, defaultHeight: 45,  color: '#8b7355', icon: '📺' },
  { id: 'armchair',     label: '單椅',     category: '客廳', defaultWidth: 80,  defaultHeight: 80,  color: '#b8a99a', icon: '🪑' },
  // 廚房
  { id: 'fridge',       label: '冰箱',     category: '廚房', defaultWidth: 70,  defaultHeight: 70,  color: '#d0e8f0', icon: '🧊' },
  { id: 'counter',      label: '流理台',   category: '廚房', defaultWidth: 180, defaultHeight: 60,  color: '#c8d8c8', icon: '🍳' },
  { id: 'stove',        label: '瓦斯爐',   category: '廚房', defaultWidth: 60,  defaultHeight: 60,  color: '#e8d8c8', icon: '🔥' },
  { id: 'island',       label: '中島',     category: '廚房', defaultWidth: 160, defaultHeight: 80,  color: '#b8d4b8', icon: '🏝️' },
  // 衛浴
  { id: 'toilet',       label: '馬桶',     category: '衛浴', defaultWidth: 40,  defaultHeight: 70,  color: '#f0f0f0', icon: '🚽' },
  { id: 'sink',         label: '洗手台',   category: '衛浴', defaultWidth: 60,  defaultHeight: 50,  color: '#e8f4f8', icon: '🚿' },
  { id: 'bathtub',      label: '獨立浴缸', category: '衛浴', defaultWidth: 80,  defaultHeight: 180, color: '#cce8f0', icon: '🛁' },
  { id: 'shower',       label: '淋浴間',   category: '衛浴', defaultWidth: 90,  defaultHeight: 90,  color: '#d8eef8', icon: '🚿' },
  // 收納
  { id: 'bookshelf',    label: '書架',     category: '收納', defaultWidth: 80,  defaultHeight: 30,  color: '#d4b896', icon: '📚' },
  { id: 'shoe-cabinet', label: '鞋櫃',     category: '收納', defaultWidth: 80,  defaultHeight: 35,  color: '#c8a878', icon: '👟' },
  { id: 'storage',      label: '收納櫃',   category: '收納', defaultWidth: 100, defaultHeight: 50,  color: '#d8c8b0', icon: '📦' },
  // 特殊（身分相關）
  { id: 'cat-tree',     label: '貓跳台',   category: '特殊', defaultWidth: 60,  defaultHeight: 60,  color: '#e8d4c0', icon: '🐈' },
  { id: 'dog-crate',    label: '狗籠/狗窩', category: '特殊', defaultWidth: 100, defaultHeight: 80,  color: '#d4c8b0', icon: '🐕' },
  { id: 'yoga-mat',     label: '瑜伽墊',   category: '特殊', defaultWidth: 60,  defaultHeight: 180, color: '#c8e8c0', icon: '🧘' },
  { id: 'plant-shelf',  label: '植物架',   category: '特殊', defaultWidth: 80,  defaultHeight: 30,  color: '#a8d4a0', icon: '🌿' },
  { id: 'projector',    label: '投影幕',   category: '特殊', defaultWidth: 200, defaultHeight: 20,  color: '#d0d0e8', icon: '🎬' },
  { id: 'dining-table', label: '餐桌',     category: '客廳', defaultWidth: 120, defaultHeight: 80,  color: '#d4b896', icon: '🍽️' },
]
