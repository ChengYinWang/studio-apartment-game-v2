import { v4 as uuidv4 } from 'uuid'
import type { Wall, Opening, FurnitureItem } from '../types'

// 15平方公尺套房（3m × 5m，1px = 1cm）
// x: 60~360（3m），y: 60~560（5m）

export const ROOM_POINTS = [
  { x: 60,  y: 60  },
  { x: 360, y: 60  },
  { x: 360, y: 560 },
  { x: 60,  y: 560 },
]

// ── 衛浴隔間分隔線預設值與限制 ──────────────────────────────────────────────
export const DEFAULT_BATH_DIV_X = 180  // 衛浴寬 1.2m（從左外牆 60 起算）
export const DEFAULT_BATH_DIV_Y = 280  // 衛浴深 2.2m（從上外牆 60 起算）
export const MIN_BATH_DIV_X = 80       // 左牆內側 + 20px 緩衝
export const MAX_BATH_DIV_X = 340      // 右牆內側 - 20px 緩衝
export const MIN_BATH_DIV_Y = 80       // 上牆內側 + 20px 緩衝
export const MAX_BATH_DIV_Y = 540      // 下牆內側 - 20px 緩衝
export const BATH_V_ID = 'bath-wall-v'
export const BATH_H_ID = 'bath-wall-h'

// ── 固定外牆 ID ──────────────────────────────────────────────────────────────
const W_TOP    = 'w-top'
const W_RIGHT  = 'w-right'
const W_BOTTOM = 'w-bottom'
const W_LEFT   = 'w-left'

export const OUTER_WALLS: Wall[] = [
  { id: W_TOP,    start: { x: 60,  y: 60  }, end: { x: 360, y: 60  }, thickness: 10 },
  { id: W_RIGHT,  start: { x: 360, y: 60  }, end: { x: 360, y: 560 }, thickness: 10 },
  { id: W_BOTTOM, start: { x: 360, y: 560 }, end: { x: 60,  y: 560 }, thickness: 10 },
  { id: W_LEFT,   start: { x: 60,  y: 560 }, end: { x: 60,  y: 60  }, thickness: 10 },
]

/** 根據目前衛浴分隔線位置計算兩道隔間牆 */
export function makeBathWalls(bathDivX: number, bathDivY: number): Wall[] {
  return [
    { id: BATH_V_ID, start: { x: bathDivX, y: 60       }, end: { x: bathDivX, y: bathDivY }, thickness: 10 },
    { id: BATH_H_ID, start: { x: 60,       y: bathDivY }, end: { x: bathDivX, y: bathDivY }, thickness: 10 },
  ]
}

// 外牆開口（固定）
export const OUTER_OPENINGS: Opening[] = [
  { id: uuidv4(), wallId: W_BOTTOM, type: 'door',   position: 0.72, width: 80  },
  { id: uuidv4(), wallId: W_RIGHT,  type: 'window', position: 0.22, width: 100 },
  { id: uuidv4(), wallId: W_RIGHT,  type: 'window', position: 0.68, width: 100 },
  { id: uuidv4(), wallId: W_TOP,    type: 'window', position: 0.12, width: 60  },
]

// 衛浴門（相對於衛浴 H 牆的比例位置，會隨牆移動）
export const BATH_DOOR = { position: 0.55, width: 65 }

// 向後相容：保留 BASE_WALLS / BASE_OPENINGS 給外部使用
export const BASE_WALLS = OUTER_WALLS
export const BASE_OPENINGS = OUTER_OPENINGS

// ── 預設家具 ─────────────────────────────────────────────────────────────────
export function makeDefaultFurniture(): FurnitureItem[] {
  return [
    // 衛浴
    { id: uuidv4(), catalogId: 'toilet',       x: 72,  y: 74,  width: 40,  height: 60,  rotation: 0, label: '馬桶',   color: '#f0f0f0' },
    { id: uuidv4(), catalogId: 'sink',         x: 118, y: 74,  width: 50,  height: 38,  rotation: 0, label: '洗手台', color: '#e8f4f8' },
    { id: uuidv4(), catalogId: 'shower',       x: 70,  y: 172, width: 100, height: 100, rotation: 0, label: '淋浴間', color: '#d8eef8' },
    // 臥室
    { id: uuidv4(), catalogId: 'single-bed',   x: 184, y: 72,  width: 90,  height: 180, rotation: 0, label: '單人床', color: '#a8d5e2' },
    { id: uuidv4(), catalogId: 'wardrobe',     x: 278, y: 72,  width: 70,  height: 55,  rotation: 0, label: '衣櫃',   color: '#d4a76a' },
    { id: uuidv4(), catalogId: 'desk',         x: 278, y: 130, width: 70,  height: 55,  rotation: 0, label: '書桌',   color: '#c8b99a' },
    // 廚房
    { id: uuidv4(), catalogId: 'counter',      x: 68,  y: 290, width: 55,  height: 120, rotation: 0, label: '流理台', color: '#c8d8c8' },
    { id: uuidv4(), catalogId: 'fridge',       x: 68,  y: 414, width: 60,  height: 60,  rotation: 0, label: '冰箱',   color: '#d0e8f0' },
    // 客廳
    { id: uuidv4(), catalogId: 'tv-cabinet',   x: 184, y: 290, width: 120, height: 38,  rotation: 0, label: '電視櫃', color: '#8b7355' },
    { id: uuidv4(), catalogId: 'sofa',         x: 182, y: 362, width: 155, height: 75,  rotation: 0, label: '沙發',   color: '#9eb3c2' },
    { id: uuidv4(), catalogId: 'coffee-table', x: 216, y: 450, width: 80,  height: 50,  rotation: 0, label: '茶几',   color: '#c4a882' },
    // 入口
    { id: uuidv4(), catalogId: 'shoe-cabinet', x: 68,  y: 520, width: 80,  height: 28,  rotation: 0, label: '鞋櫃',   color: '#c8a878' },
  ]
}
