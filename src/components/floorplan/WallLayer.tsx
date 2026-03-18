import { Layer, Line } from 'react-konva'
import { ROOM_POINTS, BASE_WALLS } from '../../data/baseDesign'

export function WallLayer() {
  const pts = ROOM_POINTS.flatMap((p) => [p.x, p.y])
  return (
    <Layer listening={false}>
      {/* Room fill */}
      <Line points={pts} closed fill="rgba(30,30,50,0.9)" stroke="transparent" />
      {/* Walls */}
      {BASE_WALLS.map((w) => (
        <Line
          key={w.id}
          points={[w.start.x, w.start.y, w.end.x, w.end.y]}
          stroke="#4a5568"
          strokeWidth={w.thickness}
          lineCap="round"
        />
      ))}
    </Layer>
  )
}
