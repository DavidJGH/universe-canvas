import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CanvasService } from '../../services/canvas-service/canvas.service';
import { Subject, takeUntil } from 'rxjs';
import { Canvas, Vector } from '../../models/canvas.model';
import { mousePosToCanvasPos } from '../../utils/canvas.utils';

@Component({
  selector: 'app-draw-canvas',
  templateUrl: './draw-canvas.component.html',
  styleUrls: ['./draw-canvas.component.scss'],
})
export class DrawCanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();

  canvas: Canvas | undefined;
  selectedColorIndex = 0;

  @ViewChild('drawCanvas') canvasElement!: ElementRef;

  displayCursor = false;
  cursorX = 0;
  cursorY = 0;

  mouseDownAt: Vector = { x: 0, y: 0 };

  constructor(private readonly canvasService: CanvasService) {}

  ngOnInit() {
    this.canvasService.selectedColorIndex$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(colorIndex => (this.selectedColorIndex = colorIndex));
  }

  ngAfterViewInit(): void {
    this.canvasService.canvas$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ canvas, changes }) => {
        this.canvas = canvas;

        const canvasHTMLElement: HTMLCanvasElement =
          this.canvasElement.nativeElement;

        if (
          canvasHTMLElement.width !== canvas.width ||
          canvasHTMLElement.height !== canvas.height
        ) {
          canvasHTMLElement.width = canvas.width;
          canvasHTMLElement.height = canvas.height;
        }
        const context = canvasHTMLElement.getContext('2d');
        if (context) {
          for (let pixelInfo of changes.content) {
            if (
              pixelInfo.position.x >= this.canvas.width ||
              pixelInfo.position.y >= this.canvas.height
            ) {
              continue;
            }
            context.fillStyle = this.canvas.palette[pixelInfo.colorIndex];
            context.fillRect(pixelInfo.position.x, pixelInfo.position.y, 1, 1);
          }
        }
      });
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
      const canvasHTMLElement: HTMLCanvasElement =
        this.canvasElement.nativeElement;
      const context = canvasHTMLElement.getContext('2d');
      if (context) {
        context.fillStyle =
          this.canvas?.palette[this.selectedColorIndex] ?? '#FFFFFF';
        context.fillRect(this.cursorX, this.cursorY, 1, 1);
      }
      this.canvasService.updatePixel(
        this.cursorX,
        this.cursorY,
        this.selectedColorIndex
      );
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
