import { Component, Input } from '@angular/core';
import { distinctUntilChanged, map, tap } from 'rxjs';
import { Canvas } from '../../../models/canvas.model';
import { CanvasService } from '../../../services/canvas-service/canvas.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-admin-configuration',
  templateUrl: './admin-configuration.component.html',
  styleUrls: [
    '../admin-interface.scss',
    './admin-configuration.component.scss',
  ],
})
export class AdminConfigurationComponent {
  canvasData$ = this.canvasService.canvas$.pipe(
    map(({ canvas }) => {
      const canvasData: Omit<Canvas, 'content'> = canvas;
      return canvasData;
    }),
    distinctUntilChanged(),
    tap(canvas => {
      if (this.currentPalette.length == 0) {
        this.resetPalette(canvas.palette);
      }
    })
  );

  currentPalette: { originalIndex: number; color: string }[] = [];

  @Input()
  token!: string;

  constructor(private readonly canvasService: CanvasService) {}

  removeColor(index: number) {
    this.currentPalette.splice(index, 1);
  }

  resetPalette(palette: string[]) {
    this.currentPalette = palette.map((color, index) => ({
      originalIndex: index,
      color: color,
    }));
  }

  colorMoved($event: CdkDragDrop<string, any>) {
    const element = this.currentPalette[$event.previousIndex];
    this.currentPalette.splice($event.previousIndex, 1);
    this.currentPalette.splice($event.currentIndex, 0, element);
  }
}
