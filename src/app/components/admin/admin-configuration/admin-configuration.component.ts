import { Component } from '@angular/core';
import { distinctUntilChanged, map } from 'rxjs';
import { Canvas } from '../../../models/canvas.model';
import { CanvasService } from '../../../services/canvas-service/canvas.service';

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
    distinctUntilChanged()
  );

  constructor(private readonly canvasService: CanvasService) {}
}
