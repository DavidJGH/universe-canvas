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

export function indexToRgb(colorIndex: number): string {
  let r = 0;
  let g = 0;
  let b = 0;
  switch (colorIndex) {
    case 0:
      r = 255;
      g = 255;
      b = 255;
      break;
    case 2:
      r = 255;
      g = 0;
      b = 0;
      break;
  }
  return 'rgba(' + r + ',' + g + ',' + b + ', 1)';
}
