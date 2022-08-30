import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CanvasService } from '../../services/canvas-service/canvas.service';
import { Subject, takeUntil } from 'rxjs';
import { getScreenCenter } from '../../utils/window.utils';

@Component({
  selector: 'app-scalable-container',
  templateUrl: './scalable-container.component.html',
  styleUrls: ['./scalable-container.component.scss'],
})
export class ScalableContainerComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();

  xPosition = 0.0;
  yPosition = 0.0;
  scale = 1.0;

  scaleFactor = 2;

  maxScale = 40;
  minScale = 0.5;

  canvasWidth = 0;
  canvasHeight = 0;

  constructor(private readonly canvasService: CanvasService) {}

  ngOnInit(): void {
    this.canvasService.canvas$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ canvas }) => {
        const wasZero = this.canvasWidth === 0;
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;

        if (wasZero) {
          const center = getScreenCenter();
          this.xPosition = center.x - this.canvasWidth / 2;
          this.yPosition = center.y - this.canvasHeight / 2;
        }
      });
  }

  @HostListener('wheel', ['$event'])
  scroll($event: WheelEvent) {
    const previousScale = this.scale;
    if ($event.deltaY > 0) {
      this.scale = Math.max(this.scale / this.scaleFactor, this.minScale);
    } else if ($event.deltaY < 0) {
      this.scale = Math.min(this.scale * this.scaleFactor, this.maxScale);
    }

    const scaleChange = this.scale / previousScale;

    const centerX = this.xPosition + this.canvasWidth / 2;
    const centerY = this.yPosition + this.canvasHeight / 2;

    this.setPosition(
      $event.clientX -
        ($event.clientX - centerX) * scaleChange -
        this.canvasWidth / 2,
      $event.clientY -
        ($event.clientY - centerY) * scaleChange -
        this.canvasHeight / 2
    );
  }

  @HostListener('mousemove', ['$event'])
  move($event: MouseEvent) {
    if ($event.buttons == 4 || $event.buttons == 2) {
      this.setPosition(
        this.xPosition + $event.movementX,
        this.yPosition + $event.movementY
      );
    }
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick($event: MouseEvent) {
    $event.preventDefault();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private setPosition(x: number, y: number) {
    const center = getScreenCenter();
    this.xPosition = Math.min(
      center.x + (this.canvasWidth * (this.scale - 1)) / 2,
      Math.max(center.x - (this.canvasWidth * (this.scale + 1)) / 2, x)
    );
    this.yPosition = Math.min(
      center.y + (this.canvasHeight * (this.scale - 1)) / 2,
      Math.max(center.y - (this.canvasHeight * (this.scale + 1)) / 2, y)
    );
  }
}
