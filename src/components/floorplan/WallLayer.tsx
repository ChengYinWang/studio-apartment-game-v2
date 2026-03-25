import { Layer, Line } from 'react-konva'
import type Konva from 'konva'
import {
  ROOM_POINTS,
  OUTER_WALLS,
  makeBathWalls,
  MIN_BATH_DIV_X, MAX_BATH_DIV_X,
  MIN_BATH_DIV_Y, MAX_BATH_DIV_Y,
  BATH_V_ID, BATH_H_ID,
} from '../../data/baseDesign'
import { useGameStore } from '../../store/useGameStore'

export function WallLayer() {
  const bathDivX = useGameStore((s) => s.bathDivX)
  const bathDivY = useGameStore((s) => s.bathDivY)
  const setBathDiv = useGameStore((s) => s.setBathDiv)

  const pts = ROOM_POINTS.flatMap((p) => [p.x, p.y])
  const bathWalls = makeBathWalls(bathDivX, bathDivY)

  const handleDragEnd = (id: string) => (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target
    if (id === BATH_V_ID) {
      // node.x() 是相對於原點的位移，加上目前的 bathDivX 才是新的絕對位置
      const newX = Math.min(MAX_BATH_DIV_X, Math.max(MIN_BATH_DIV_X, bathDivX + node.x()))
      setBathDiv(newX, bathDivY)
    } else {
      const newY = Math.min(MAX_BATH_DIV_Y, Math.max(MIN_BATH_DIV_Y, bathDivY + node.y()))
      setBathDiv(bathDivX, newY)
    }
    // 重置 node 位置，讓 points 的絕對座標接管
    node.position({ x: 0, y: 0 })
  }

  return (
    <Layer>
      {/* Room fill */}
      <Line points={pts} closed fill="rgba(30,30,50,0.9)" stroke="transparent" listening={false} />

      {/* Static outer walls */}
      {OUTER_WALLS.map((w) => (
        <Line
          key={w.id}
          points={[w.start.x, w.start.y, w.end.x, w.end.y]}
          stroke="#4a5568"
          strokeWidth={w.thickness}
          lineCap="round"
          listening={false}
        />
      ))}

      {/* Draggable bath walls */}
      {bathWalls.map((w) => {
        const isVertical = w.id === BATH_V_ID
        return (
          <Line
            key={w.id}
            points={[w.start.x, w.start.y, w.end.x, w.end.y]}
            stroke="#64748b"
            strokeWidth={w.thickness}
            lineCap="round"
            draggable
            dragBoundFunc={(pos) =>
              isVertical
                ? { x: pos.x, y: 0 }   // 垂直牆只能左右移動
                : { x: 0, y: pos.y }    // 水平牆只能上下移動
            }
            onDragEnd={handleDragEnd(w.id)}
            hitStrokeWidth={20}
            onMouseEnter={(e) => {
              const stage = e.target.getStage()
              if (stage) stage.container().style.cursor = isVertical ? 'ew-resize' : 'ns-resize'
            }}
            onMouseLeave={(e) => {
              const stage = e.target.getStage()
              if (stage) stage.container().style.cursor = 'default'
            }}
          />
        )
      })}
    </Layer>
  )
}
