import { Layer, Line, Arc, Group } from 'react-konva'
import { OUTER_WALLS, OUTER_OPENINGS, makeBathWalls, BATH_H_ID, BATH_DOOR } from '../../data/baseDesign'
import { useGameStore } from '../../store/useGameStore'
import type { Wall, Opening } from '../../types'
import { v4 as uuidv4 } from 'uuid'

function renderOpening(opening: Opening, wall: Wall) {
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
}

export function OpeningLayer() {
  const bathDivX = useGameStore((s) => s.bathDivX)
  const bathDivY = useGameStore((s) => s.bathDivY)

  const bathWalls = makeBathWalls(bathDivX, bathDivY)
  const bathHWall = bathWalls.find((w) => w.id === BATH_H_ID)!

  // Bath door is on the horizontal wall, position relative to that wall
  const bathDoorOpening: Opening = {
    id: 'bath-door',
    wallId: BATH_H_ID,
    type: 'door',
    position: BATH_DOOR.position,
    width: BATH_DOOR.width,
  }

  return (
    <Layer listening={false}>
      {/* Outer wall openings */}
      {OUTER_OPENINGS.map((opening) => {
        const wall = OUTER_WALLS.find((w) => w.id === opening.wallId)
        if (!wall) return null
        return renderOpening(opening, wall)
      })}

      {/* Bath door on horizontal partition wall */}
      {renderOpening(bathDoorOpening, bathHWall)}
    </Layer>
  )
}
