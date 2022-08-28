export interface Canvas {
  width: number;
  height: number;
  content: number[];
  palette: string[];
}

export interface PartialCanvas {
  content: PixelInfo[];
}

export interface PixelInfo {
  position: Vector;
  colorIndex: number;
}

export interface Vector {
  x: number;
  y: number;
}
