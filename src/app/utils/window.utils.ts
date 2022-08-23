import { Vector } from '../models/canvas.model';

export function getScreenCenter(): Vector {
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}
