import { Layer, Line } from 'react-konva'

export function GridLayer({ width, height, gridSize }: { width: number; height: number; gridSize: number }) {
  const lines: React.ReactElement[] = []
  for (let x = 0; x <= width; x += gridSize)
    lines.push(<Line key={`v${x}`} points={[x, 0, x, height]} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />)
  for (let y = 0; y <= height; y += gridSize)
    lines.push(<Line key={`h${y}`} points={[0, y, width, y]} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />)
  return <Layer listening={false}>{lines}</Layer>
}
