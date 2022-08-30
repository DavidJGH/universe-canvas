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
import {
  getLineBetweenPoints,
  mousePosToCanvasPos,
} from '../../utils/canvas.utils';

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
  private canvasHTMLElement: HTMLCanvasElement | undefined;
  private canvasContext: CanvasRenderingContext2D | undefined = undefined;

  displayCursor = false;
  cursorX = 0;
  cursorY = 0;

  private drawing = false;
  private currentDrawPixels: Vector[] = [];

  constructor(private readonly canvasService: CanvasService) {}

  ngOnInit() {
    this.canvasService.selectedColorIndex$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(colorIndex => (this.selectedColorIndex = colorIndex));
  }

  ngAfterViewInit(): void {
    this.canvasHTMLElement = this.canvasElement.nativeElement;
    this.canvasContext = this.canvasHTMLElement?.getContext('2d') ?? undefined;
    this.canvasService.canvas$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ canvas, changes }) => {
        this.canvas = canvas;

        if (
          this.canvasHTMLElement &&
          (this.canvasHTMLElement.width !== canvas.width ||
            this.canvasHTMLElement.height !== canvas.height)
        ) {
          this.canvasHTMLElement.width = canvas.width;
          this.canvasHTMLElement.height = canvas.height;
        }
        if (this.canvasContext) {
          for (let pixelInfo of changes.content) {
            if (
              pixelInfo.position.x >= this.canvas.width ||
              pixelInfo.position.y >= this.canvas.height
            ) {
              continue;
            }
            this.canvasContext.fillStyle =
              this.canvas.palette[pixelInfo.colorIndex];
            this.canvasContext.fillRect(
              pixelInfo.position.x,
              pixelInfo.position.y,
              1,
              1
            );
          }
        }
      });
  }

  mouseAction($event: MouseEvent) {
    const canvasPos = mousePosToCanvasPos(
      this.canvasElement.nativeElement,
      $event
    );
    this.cursorX = canvasPos.x;
    this.cursorY = canvasPos.y;
    if ($event.buttons == 1) {
      this.drawing = true;
    } else {
      this.drawing = false;
      this.currentDrawPixels = [];
    }
    if (
      this.drawing &&
      !this.currentDrawPixels.some(
        pixel => pixel.x == this.cursorX && pixel.y == this.cursorY
      )
    ) {
      const currentPixel: Vector = { x: this.cursorX, y: this.cursorY };
      const lastPixel =
        this.currentDrawPixels[this.currentDrawPixels.length - 1];
      if (
        lastPixel &&
        (Math.abs(currentPixel.x - lastPixel.x) > 1 ||
          Math.abs(currentPixel.y - lastPixel.y) > 1)
      ) {
        const positions = getLineBetweenPoints(lastPixel, currentPixel);
        for (let position of positions) {
          this.drawPixel(position);
        }
      } else {
        this.drawPixel(currentPixel);
      }
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private drawPixel(position: Vector) {
    if (
      this.currentDrawPixels.some(
        pixel => pixel.x == this.cursorX && pixel.y == this.cursorY
      )
    ) {
      return;
    }
    if (this.canvasContext) {
      this.canvasContext.fillStyle =
        this.canvas?.palette[this.selectedColorIndex] ?? '#FFFFFF';
      this.canvasContext.fillRect(position.x, position.y, 1, 1);
    }
    this.canvasService.updatePixel(
      position.x,
      position.y,
      this.selectedColorIndex
    );
    this.currentDrawPixels.push(position);
  }
}
