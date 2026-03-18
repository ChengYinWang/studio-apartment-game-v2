import { useRef, useEffect, useState } from 'react'
import { Stage } from 'react-konva'
import type Konva from 'konva'
import { GridLayer } from './GridLayer'
import { WallLayer } from './WallLayer'
import { OpeningLayer } from './OpeningLayer'
import { FurnitureLayer } from './FurnitureLayer'
import { useGameStore } from '../../store/useGameStore'
import { useSnapToGrid } from '../../hooks/useSnapToGrid'
import { furnitureCatalog } from '../../data/furniture'

const GRID = 20

interface Props {
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export function GameFloorPlan({ selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 800, height: 600 })
  const { pendingCatalogId, addFurniture, setPendingCatalogId } = useGameStore()
  const { snapPoint } = useSnapToGrid()

  useEffect(() => {
    const update = () => {
      if (containerRef.current)
        setSize({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight })
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Delete key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setPendingCatalogId(null); onSelect(null) }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        useGameStore.getState().removeFurniture(selectedId)
        onSelect(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId])

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage()
    if (!stage) return
    const raw = stage.getPointerPosition()
    if (!raw) return

    if (pendingCatalogId) {
      const catalog = furnitureCatalog.find((c) => c.id === pendingCatalogId)
      if (!catalog) return
      const pos = snapPoint(raw.x - catalog.defaultWidth / 2, raw.y - catalog.defaultHeight / 2)
      addFurniture({
        catalogId: catalog.id,
        x: pos.x, y: pos.y,
        width: catalog.defaultWidth,
        height: catalog.defaultHeight,
        rotation: 0,
        label: catalog.label,
        color: catalog.color,
      })
      return
    }

    if (e.target === stage) onSelect(null)
  }

  const cursor = pendingCatalogId ? 'cell' : 'default'

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[#0e0e1f] rounded-xl overflow-hidden"
      style={{ cursor }}
    >
      <Stage width={size.width} height={size.height} onClick={handleStageClick}>
        <GridLayer width={size.width} height={size.height} gridSize={GRID} />
        <WallLayer />
        <OpeningLayer />
        <FurnitureLayer selectedId={selectedId} onSelect={onSelect} />
      </Stage>
    </div>
  )
}
