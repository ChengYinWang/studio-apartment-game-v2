import { Layer, Line, Arc, Group } from 'react-konva'
import { BASE_WALLS, BASE_OPENINGS } from '../../data/baseDesign'

export function OpeningLayer() {
  return (
    <Layer listening={false}>
      {BASE_OPENINGS.map((opening) => {
        const wall = BASE_WALLS.find((w) => w.id === opening.wallId)
        if (!wall) return null
        const dx = wall.end.x - wall.start.x
        const dy = wall.end.y - wall.start.y
        const len = Math.sqrt(dx * dx + dy * dy)
        const nx = dx / len, ny = dy / len
        const cx = wall.start.x + dx * opening.position
        const cy = wall.start.y + dy * opening.position
        const hw = opening.width / 2
        const x1 = cx - nx * hw, y1 = cy - ny * hw
        const x2 = cx + nx * hw, y2 = cy + ny * hw
        const angle = Math.atan2(dy, dx) * 180 / Math.PI

        return (
          <Group key={opening.id}>
            <Line points={[x1, y1, x2, y2]} stroke="#1e1e32" strokeWidth={wall.thickness + 4} />
            {opening.type === 'door' ? (
              <Arc x={x1} y={y1} innerRadius={0} outerRadius={opening.width}
                angle={90} rotation={angle} stroke="#6366f1" strokeWidth={1.5}
                fill="rgba(99,102,241,0.08)" />
            ) : (
              <Line points={[x1, y1, x2, y2]} stroke="#38bdf8" strokeWidth={3} dash={[6, 4]} />
            )}
          </Group>
        )
      })}
    </Layer>
  )
}
