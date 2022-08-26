import { Vector } from '../models/canvas.model';

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
