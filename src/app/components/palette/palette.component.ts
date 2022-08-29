import { Component, OnDestroy, OnInit } from '@angular/core';
import { CanvasService } from '../../services/canvas-service/canvas.service';
import { map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss'],
})
export class PaletteComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();

  palette$ = this.canvasService.canvas$.pipe(
    map(({ canvas }) => canvas.palette)
  );
  selectedColorIndex = 0;

  constructor(private readonly canvasService: CanvasService) {}

  isActive(index: number) {
    return index === this.selectedColorIndex;
  }

  selectColor(index: number) {
    this.canvasService.setColorIndex(index);
  }

  ngOnInit() {
    this.canvasService.selectedColorIndex$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(colorIndex => (this.selectedColorIndex = colorIndex));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
