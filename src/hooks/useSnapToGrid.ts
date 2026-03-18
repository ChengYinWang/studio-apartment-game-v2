const GRID_SIZE = 20

export function useSnapToGrid() {
  const snap = (v: number) => Math.round(v / GRID_SIZE) * GRID_SIZE
  const snapPoint = (x: number, y: number) => ({ x: snap(x), y: snap(y) })
  return { snap, snapPoint, gridSize: GRID_SIZE }
}
