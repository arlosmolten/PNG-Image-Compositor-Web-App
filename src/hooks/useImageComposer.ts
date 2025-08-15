import { useState, useCallback } from 'react';
import { ImageLayer } from '../types';

export const useImageComposer = () => {
  const [layers, setLayers] = useState<ImageLayer[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  const addImages = useCallback((files: File[]) => {
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const newLayer: ImageLayer = {
            id: `layer-${Date.now()}-${index}`,
            name: file.name,
            src: e.target?.result as string,
            x: 50 + index * 20,
            y: 50 + index * 20,
            width: img.width,
            height: img.height,
            originalWidth: img.width,
            originalHeight: img.height,
            zIndex: layers.length + index,
            visible: true,
            selected: false,
          };

          setLayers(prev => [...prev, newLayer]);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }, [layers.length]);

  const updateLayer = useCallback((id: string, updates: Partial<ImageLayer>) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === id ? { ...layer, ...updates } : layer
      )
    );
  }, []);

  const selectLayer = useCallback((id: string) => {
    setLayers(prev =>
      prev.map(layer => ({
        ...layer,
        selected: layer.id === id,
      }))
    );
  }, []);

  const toggleLayerVisibility = useCallback((id: string) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      )
    );
  }, []);

  const moveLayer = useCallback((id: string, direction: 'up' | 'down') => {
    setLayers(prev => {
      const newLayers = [...prev];
      const layerIndex = newLayers.findIndex(l => l.id === id);
      const layer = newLayers[layerIndex];
      
      if (direction === 'up') {
        layer.zIndex = Math.min(layer.zIndex + 1, Math.max(...newLayers.map(l => l.zIndex)) + 1);
      } else {
        layer.zIndex = Math.max(layer.zIndex - 1, 0);
      }
      
      return newLayers;
    });
  }, []);

  const deleteLayer = useCallback((id: string) => {
    setLayers(prev => prev.filter(layer => layer.id !== id));
  }, []);

  const exportImage = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Sort layers by z-index
    const sortedLayers = [...layers]
      .filter(layer => layer.visible)
      .sort((a, b) => a.zIndex - b.zIndex);

    // Create promises for all images
    const imagePromises = sortedLayers.map(layer => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, layer.x, layer.y, layer.width, layer.height);
          resolve();
        };
        img.src = layer.src;
      });
    });

    // Wait for all images to load and draw, then export
    Promise.all(imagePromises).then(() => {
      const link = document.createElement('a');
      link.download = 'composed-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }, [layers, canvasSize]);

  return {
    layers,
    canvasSize,
    setCanvasSize,
    addImages,
    updateLayer,
    selectLayer,
    toggleLayerVisibility,
    moveLayer,
    deleteLayer,
    exportImage,
  };
};