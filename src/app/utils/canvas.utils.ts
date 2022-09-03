import { Canvas, PartialCanvas, Vector } from '../models/canvas.model';

export function mousePosToCanvasPos(
  canvas: HTMLCanvasElement,
  evt: MouseEvent
): Vector {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.floor(
      ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width
    ),
    y: Math.floor(
      ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
    ),
  };
}

export function canvasToPartialCanvas(canvas: Canvas): PartialCanvas {
  return {
    content: canvas.content.map((value, index) => ({
      colorIndex: value,
      position: {
        x: index % canvas.width,
        y: Math.floor(index / canvas.width),
      },
    })),
  };
}

export function getLineBetweenPoints(
  position1: Vector,
  position2: Vector,
  includeStartPos: boolean = false
): Vector[] {
  const coordinatesArray: Vector[] = [];

  let x1 = position1.x;
  let y1 = position1.y;
  const x2 = position2.x;
  const y2 = position2.y;

  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  if (includeStartPos) {
    coordinatesArray.push({ x: x1, y: y1 });
  }

  while (!(x1 == x2 && y1 == y2)) {
    const e2 = err << 1;
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
    coordinatesArray.push({ x: x1, y: y1 });
  }
  return coordinatesArray;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 };
}
