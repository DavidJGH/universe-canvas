import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CanvasService } from '../../services/canvas-service/canvas.service';
import { Subject, takeUntil } from 'rxjs';
import { Vector } from '../../models/canvas.model';
import { mousePosToCanvasPos } from '../../utils/canvas.utils';

@Component({
  selector: 'app-draw-canvas',
  templateUrl: './draw-canvas.component.html',
  styleUrls: ['./draw-canvas.component.scss'],
})
export class DrawCanvasComponent implements AfterViewInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();

  @ViewChild('drawCanvas') canvasElement!: ElementRef;

  displayCursor = false;
  cursorX = 0;
  cursorY = 0;

  mouseDownAt: Vector = { x: 0, y: 0 };

  constructor(private readonly canvasService: CanvasService) {}

  ngAfterViewInit(): void {
    this.canvasService.canvas$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(canvas => {
        const colorsRGB = canvas.content.map(index => canvas.palette[index]);

        const canvasHTMLElement: HTMLCanvasElement =
          this.canvasElement.nativeElement;

        canvasHTMLElement.width = canvas.width;
        canvasHTMLElement.height = canvas.height;
        const context = canvasHTMLElement.getContext('2d');
        if (context) {
          for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
              if (colorsRGB.length <= i + j * canvas.width) {
                return;
              }
              context.fillStyle = colorsRGB[i + j * canvas.width];
              context.fillRect(i, j, 1, 1);
            }
          }
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  cursorMove($event: MouseEvent) {
    const canvasPos = mousePosToCanvasPos(
      this.canvasElement.nativeElement,
      $event
    );
    this.cursorX = canvasPos.x;
    this.cursorY = canvasPos.y;
  }

  mouseDown($event: MouseEvent) {
    this.mouseDownAt = { x: $event.x, y: $event.y };
  }

  mouseUp($event: MouseEvent) {
    if (
      Math.sqrt(
        Math.pow(this.mouseDownAt.x - $event.x, 2) +
          Math.pow(this.mouseDownAt.y - $event.y, 2)
      ) < 5
    ) {
      this.canvasService.updatePixel(
        this.cursorX,
        this.cursorY,
        this.canvasService.selectedColorIndex
      );
    }
  }
}
