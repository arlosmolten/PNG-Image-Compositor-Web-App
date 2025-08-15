import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ImageLayer } from '../types';

interface CanvasProps {
  layers: ImageLayer[];
  onLayerUpdate: (id: string, updates: Partial<ImageLayer>) => void;
  onLayerSelect: (id: string) => void;
  canvasWidth: number;
  canvasHeight: number;
}

interface DragState {
  isDragging: boolean;
  dragType: 'move' | 'resize';
  startX: number;
  startY: number;
  startLayerX: number;
  startLayerY: number;
  startLayerWidth: number;
  startLayerHeight: number;
  layerId: string;
}

export const Canvas: React.FC<CanvasProps> = ({
  layers,
  onLayerUpdate,
  onLayerSelect,
  canvasWidth,
  canvasHeight,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());

  // Load images
  useEffect(() => {
    const loadImage = (layer: ImageLayer) => {
      if (loadedImages.has(layer.id)) return;

      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Map(prev).set(layer.id, img));
      };
      img.src = layer.src;
    };

    layers.forEach(loadImage);
  }, [layers, loadedImages]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid background
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    const gridSize = 20;

    for (let x = 0; x <= canvasWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }

    for (let y = 0; y <= canvasHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    // Draw layers in z-index order
    const sortedLayers = [...layers]
      .filter(layer => layer.visible)
      .sort((a, b) => a.zIndex - b.zIndex);

    sortedLayers.forEach(layer => {
      const img = loadedImages.get(layer.id);
      if (!img) return;

      ctx.drawImage(img, layer.x, layer.y, layer.width, layer.height);

      // Draw selection outline
      if (layer.selected) {
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(layer.x, layer.y, layer.width, layer.height);
        ctx.setLineDash([]);

        // Draw resize handle
        const handleSize = 8;
        ctx.fillStyle = '#3B82F6';
        ctx.fillRect(
          layer.x + layer.width - handleSize / 2,
          layer.y + layer.height - handleSize / 2,
          handleSize,
          handleSize
        );
      }
    });
  }, [layers, loadedImages, canvasWidth, canvasHeight]);

  const getLayerAt = useCallback((x: number, y: number): ImageLayer | null => {
    // Check layers in reverse z-index order (top to bottom)
    const sortedLayers = [...layers]
      .filter(layer => layer.visible)
      .sort((a, b) => b.zIndex - a.zIndex);

    for (const layer of sortedLayers) {
      if (
        x >= layer.x &&
        x <= layer.x + layer.width &&
        y >= layer.y &&
        y <= layer.y + layer.height
      ) {
        return layer;
      }
    }
    return null;
  }, [layers]);

  const isResizeHandle = useCallback((x: number, y: number, layer: ImageLayer): boolean => {
    const handleSize = 8;
    const handleX = layer.x + layer.width - handleSize / 2;
    const handleY = layer.y + layer.height - handleSize / 2;
    
    return (
      x >= handleX &&
      x <= handleX + handleSize &&
      y >= handleY &&
      y <= handleY + handleSize
    );
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const layer = getLayerAt(x, y);
    if (!layer) return;

    onLayerSelect(layer.id);

    const isResize = isResizeHandle(x, y, layer);
    
    setDragState({
      isDragging: true,
      dragType: isResize ? 'resize' : 'move',
      startX: x,
      startY: y,
      startLayerX: layer.x,
      startLayerY: layer.y,
      startLayerWidth: layer.width,
      startLayerHeight: layer.height,
      layerId: layer.id,
    });
  }, [getLayerAt, isResizeHandle, onLayerSelect]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState || !dragState.isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const deltaX = x - dragState.startX;
    const deltaY = y - dragState.startY;

    if (dragState.dragType === 'move') {
      onLayerUpdate(dragState.layerId, {
        x: Math.max(0, Math.min(canvasWidth - 50, dragState.startLayerX + deltaX)),
        y: Math.max(0, Math.min(canvasHeight - 50, dragState.startLayerY + deltaY)),
      });
    } else if (dragState.dragType === 'resize') {
      const newWidth = Math.max(20, dragState.startLayerWidth + deltaX);
      const newHeight = Math.max(20, dragState.startLayerHeight + deltaY);
      
      onLayerUpdate(dragState.layerId, {
        width: Math.min(canvasWidth - dragState.startLayerX, newWidth),
        height: Math.min(canvasHeight - dragState.startLayerY, newHeight),
      });
    }
  }, [dragState, onLayerUpdate, canvasWidth, canvasHeight]);

  const handleMouseUp = useCallback(() => {
    setDragState(null);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setDragState(null);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="border border-gray-300 rounded cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
};