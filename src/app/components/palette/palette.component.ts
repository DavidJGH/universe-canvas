import { Component } from '@angular/core';
import { CanvasService } from '../../services/canvas-service/canvas.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss'],
})
export class PaletteComponent {
  palette$ = this.canvasService.canvas$.pipe(map(canvas => canvas.palette));

  constructor(private readonly canvasService: CanvasService) {}

  isActive(index: number) {
    return index === this.canvasService.selectedColorIndex;
  }

  selectColor(index: number) {
    this.canvasService.selectedColorIndex = index;
  }
}
