import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
  hexToRgb,
  mousePosToCanvasPos,
} from '../../utils/canvas.utils';

@Component({
  selector: 'app-draw-canvas',
  templateUrl: './draw-canvas.component.html',
  styleUrls: ['./draw-canvas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  private previousMousePos: Vector | undefined = undefined;

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
        if (canvas.width === 0 || canvas.height === 0) {
          return;
        }

        this.canvas = canvas;

        const rgbPalette = canvas.palette.map(hexColor => hexToRgb(hexColor));

        if (
          this.canvasHTMLElement &&
          (this.canvasHTMLElement.width !== canvas.width ||
            this.canvasHTMLElement.height !== canvas.height)
        ) {
          this.canvasHTMLElement.width = canvas.width;
          this.canvasHTMLElement.height = canvas.height;
        }
        if (this.canvasContext) {
          const imgData = this.canvasContext.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          for (let pixelInfo of changes.content) {
            if (
              pixelInfo.position.x >= this.canvas.width ||
              pixelInfo.position.y >= this.canvas.height
            ) {
              continue;
            }
            const baseIndex =
              (pixelInfo.position.x + pixelInfo.position.y * canvas.width) * 4;
            const currentColor = rgbPalette[pixelInfo.colorIndex];
            imgData.data[baseIndex] = currentColor.r;
            imgData.data[baseIndex + 1] = currentColor.g;
            imgData.data[baseIndex + 2] = currentColor.b;
            imgData.data[baseIndex + 3] = 255;
          }
          this.canvasContext.putImageData(imgData, 0, 0);
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
      if (
        this.previousMousePos &&
        (Math.abs(canvasPos.x - this.previousMousePos.x) > 1 ||
          Math.abs(canvasPos.y - this.previousMousePos.y) > 1)
      ) {
        const positions = getLineBetweenPoints(
          this.previousMousePos,
          canvasPos
        );
        for (let position of positions) {
          this.drawPixel(position);
        }
      } else {
        this.drawPixel(canvasPos);
      }
    }
    if ($event.buttons == 1) {
      this.previousMousePos = canvasPos;
    } else {
      this.previousMousePos = undefined;
    }
  }

  mouseOut($event: MouseEvent) {
    this.mouseAction($event);
    this.previousMousePos = undefined;
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
    if (
      position.x < 0 ||
      position.x >= this.canvas!.width ||
      position.y < 0 ||
      position.y >= this.canvas!.height
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
