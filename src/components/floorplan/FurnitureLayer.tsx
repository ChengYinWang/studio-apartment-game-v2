import { useRef } from 'react'
import { Layer, Rect, Text, Group, Transformer } from 'react-konva'
import type Konva from 'konva'
import { useGameStore } from '../../store/useGameStore'

interface Props {
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export function FurnitureLayer({ selectedId, onSelect }: Props) {
  const { furniture, moveFurniture, removeFurniture } = useGameStore()
  const transformerRef = useRef<Konva.Transformer>(null)
  const nodeRefs = useRef<Map<string, Konva.Group>>(new Map())

  const handleSelect = (id: string) => {
    onSelect(id)
    const node = nodeRefs.current.get(id)
    if (node && transformerRef.current) {
      transformerRef.current.nodes([node])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }

  const handleDragEnd = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
    moveFurniture(id, e.target.x(), e.target.y())
  }

  return (
    <Layer>
      {furniture.map((item) => {
        const isSelected = selectedId === item.id
        return (
          <Group
            key={item.id}
            ref={(node) => {
              if (node) nodeRefs.current.set(item.id, node)
              else nodeRefs.current.delete(item.id)
            }}
            x={item.x} y={item.y} rotation={item.rotation}
            draggable
            onClick={() => handleSelect(item.id)}
            onTap={() => handleSelect(item.id)}
            onDragEnd={(e) => handleDragEnd(item.id, e)}
          >
            <Rect
              width={item.width} height={item.height}
              fill={item.color}
              stroke={isSelected ? '#a78bfa' : 'rgba(255,255,255,0.15)'}
              strokeWidth={isSelected ? 2 : 0.5}
              cornerRadius={3}
              shadowBlur={isSelected ? 8 : 0}
              shadowColor="#7c3aed"
            />
            <Text
              text={item.label}
              width={item.width} height={item.height}
              align="center" verticalAlign="middle"
              fontSize={Math.min(11, item.width / 4, item.height / 2)}
              fill="rgba(0,0,0,0.7)" listening={false}
            />
          </Group>
        )
      })}
      {selectedId && furniture.find((f) => f.id === selectedId) && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={true}
          keepRatio={false}
          boundBoxFunc={(oldBox, newBox) =>
            newBox.width < 20 || newBox.height < 20 ? oldBox : newBox
          }
        />
      )}
    </Layer>
  )
}
