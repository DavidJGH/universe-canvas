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
