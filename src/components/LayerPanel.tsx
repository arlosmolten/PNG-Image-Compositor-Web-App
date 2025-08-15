import React from 'react';
import { ImageLayer } from '../types';
import { Eye, EyeOff, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

interface LayerPanelProps {
  layers: ImageLayer[];
  onLayerSelect: (id: string) => void;
  onLayerToggleVisibility: (id: string) => void;
  onLayerMove: (id: string, direction: 'up' | 'down') => void;
  onLayerDelete: (id: string) => void;
  onLayerUpdate: (id: string, updates: Partial<ImageLayer>) => void;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({
  layers,
  onLayerSelect,
  onLayerToggleVisibility,
  onLayerMove,
  onLayerDelete,
  onLayerUpdate,
}) => {
  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Layers</h3>
      
      {sortedLayers.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No layers yet</p>
      ) : (
        <div className="space-y-2">
          {sortedLayers.map((layer) => (
            <div
              key={layer.id}
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                layer.selected
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onLayerSelect(layer.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm truncate flex-1">
                  {layer.name}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerMove(layer.id, 'up');
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                    disabled={layer.zIndex === Math.max(...layers.map(l => l.zIndex))}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerMove(layer.id, 'down');
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                    disabled={layer.zIndex === Math.min(...layers.map(l => l.zIndex))}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerToggleVisibility(layer.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {layer.visible ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerDelete(layer.id);
                    }}
                    className="p-1 hover:bg-red-200 rounded text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {layer.selected && (
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">X</label>
                    <input
                      type="number"
                      value={Math.round(layer.x)}
                      onChange={(e) => onLayerUpdate(layer.id, { x: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Y</label>
                    <input
                      type="number"
                      value={Math.round(layer.y)}
                      onChange={(e) => onLayerUpdate(layer.id, { y: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Width</label>
                    <input
                      type="number"
                      value={Math.round(layer.width)}
                      onChange={(e) => onLayerUpdate(layer.id, { width: parseInt(e.target.value) || 1 })}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Height</label>
                    <input
                      type="number"
                      value={Math.round(layer.height)}
                      onChange={(e) => onLayerUpdate(layer.id, { height: parseInt(e.target.value) || 1 })}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};