import React from 'react';
import { Download, Settings } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { Canvas } from './components/Canvas';
import { LayerPanel } from './components/LayerPanel';
import { useImageComposer } from './hooks/useImageComposer';

function App() {
  const {
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
  } = useImageComposer();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">PNG Image Compositor</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Canvas:</span>
              <input
                type="number"
                value={canvasSize.width}
                onChange={(e) => setCanvasSize(prev => ({ ...prev, width: parseInt(e.target.value) || 800 }))}
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                placeholder="Width"
              />
              <span className="text-gray-400">×</span>
              <input
                type="number"
                value={canvasSize.height}
                onChange={(e) => setCanvasSize(prev => ({ ...prev, height: parseInt(e.target.value) || 600 }))}
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                placeholder="Height"
              />
            </div>
            <button
              onClick={exportImage}
              disabled={layers.length === 0}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              <span>Export PNG</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Canvas Area */}
          <div className="lg:col-span-3 space-y-6">
            {layers.length === 0 ? (
              <FileUpload onFilesAdded={addImages} />
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Canvas</h2>
                    <button
                      onClick={() => document.getElementById('add-more-files')?.click()}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Add More Images
                    </button>
                    <input
                      id="add-more-files"
                      type="file"
                      multiple
                      accept="image/png"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []).filter(
                          file => file.type === 'image/png'
                        );
                        if (files.length > 0) {
                          addImages(files);
                        }
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
                <Canvas
                  layers={layers}
                  onLayerUpdate={updateLayer}
                  onLayerSelect={selectLayer}
                  canvasWidth={canvasSize.width}
                  canvasHeight={canvasSize.height}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <LayerPanel
              layers={layers}
              onLayerSelect={selectLayer}
              onLayerToggleVisibility={toggleLayerVisibility}
              onLayerMove={moveLayer}
              onLayerDelete={deleteLayer}
              onLayerUpdate={updateLayer}
            />

            {layers.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Instructions</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• Click on images in the canvas to select them</p>
                  <p>• Drag images to move them around</p>
                  <p>• Drag the blue square to resize selected images</p>
                  <p>• Use the layer panel to control visibility and order</p>
                  <p>• Export preserves PNG transparency</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;