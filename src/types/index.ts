export interface ImageLayer {
  id: string;
  name: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  zIndex: number;
  visible: boolean;
  selected: boolean;
}

export interface CanvasState {
  width: number;
  height: number;
  scale: number;
  offsetX: number;
  offsetY: number;
}