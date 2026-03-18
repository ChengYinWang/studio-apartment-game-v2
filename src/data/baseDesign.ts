import { v4 as uuidv4 } from 'uuid'
import type { Wall, Opening, FurnitureItem } from '../types'

// 15坪標準套房基礎平面圖（牆壁固定，家具可由玩家自由替換）
// 格局：衛浴左上、廚房沿左牆、臥睡右側、入口在下

export const ROOM_POINTS = [
  { x: 60, y: 60 },
  { x: 740, y: 60 },
  { x: 740, y: 740 },
  { x: 60, y: 740 },
]

const wTop    = uuidv4()
const wRight  = uuidv4()
const wBottom = uuidv4()
const wLeft   = uuidv4()
const wBathV  = uuidv4()
const wBathH  = uuidv4()

export const BASE_WALLS: Wall[] = [
  { id: wTop,    start: { x: 60,  y: 60  }, end: { x: 740, y: 60  }, thickness: 15 },
  { id: wRight,  start: { x: 740, y: 60  }, end: { x: 740, y: 740 }, thickness: 15 },
  { id: wBottom, start: { x: 740, y: 740 }, end: { x: 60,  y: 740 }, thickness: 15 },
  { id: wLeft,   start: { x: 60,  y: 740 }, end: { x: 60,  y: 60  }, thickness: 15 },
  { id: wBathV,  start: { x: 280, y: 60  }, end: { x: 280, y: 320 }, thickness: 12 },
  { id: wBathH,  start: { x: 60,  y: 320 }, end: { x: 280, y: 320 }, thickness: 12 },
]

export const BASE_OPENINGS: Opening[] = [
  // 主入口門（下牆，t≈0.40）
  { id: uuidv4(), wallId: wBottom, type: 'door',   position: 0.40, width: 90  },
  // 衛浴門（衛浴底牆，t≈0.60）
  { id: uuidv4(), wallId: wBathH,  type: 'door',   position: 0.60, width: 75  },
  // 右牆上段窗（t≈0.25）
  { id: uuidv4(), wallId: wRight,  type: 'window', position: 0.25, width: 140 },
  // 右牆下段窗（t≈0.65）
  { id: uuidv4(), wallId: wRight,  type: 'window', position: 0.65, width: 120 },
  // 上牆衛浴通風小窗
  { id: uuidv4(), wallId: wTop,    type: 'window', position: 0.12, width: 80  },
]

// 預設家具（玩家進入時的初始配置，可增減）
export function makeDefaultFurniture(): FurnitureItem[] {
  return [
    { id: uuidv4(), catalogId: 'toilet',    x: 75,  y: 75,  width: 40,  height: 70,  rotation: 0, label: '馬桶',   color: '#f0f0f0' },
    { id: uuidv4(), catalogId: 'sink',      x: 75,  y: 180, width: 60,  height: 50,  rotation: 0, label: '洗手台', color: '#e8f4f8' },
    { id: uuidv4(), catalogId: 'double-bed',x: 300, y: 75,  width: 160, height: 200, rotation: 0, label: '雙人床', color: '#7ec8e3' },
    { id: uuidv4(), catalogId: 'wardrobe',  x: 490, y: 75,  width: 120, height: 60,  rotation: 0, label: '衣櫃',   color: '#d4a76a' },
    { id: uuidv4(), catalogId: 'desk',      x: 490, y: 160, width: 140, height: 65,  rotation: 0, label: '書桌',   color: '#c8b99a' },
    { id: uuidv4(), catalogId: 'sofa',      x: 300, y: 430, width: 200, height: 90,  rotation: 0, label: '沙發',   color: '#9eb3c2' },
    { id: uuidv4(), catalogId: 'tv-cabinet',x: 300, y: 360, width: 160, height: 45,  rotation: 0, label: '電視櫃', color: '#8b7355' },
    { id: uuidv4(), catalogId: 'coffee-table', x: 360, y: 540, width: 100, height: 60, rotation: 0, label: '茶几', color: '#c4a882' },
    { id: uuidv4(), catalogId: 'fridge',    x: 75,  y: 360, width: 70,  height: 70,  rotation: 0, label: '冰箱',   color: '#d0e8f0' },
    { id: uuidv4(), catalogId: 'counter',   x: 75,  y: 450, width: 180, height: 60,  rotation: 0, label: '流理台', color: '#c8d8c8' },
    { id: uuidv4(), catalogId: 'shoe-cabinet', x: 75, y: 690, width: 80, height: 35, rotation: 0, label: '鞋櫃',  color: '#c8a878' },
  ]
}
