import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CanvasService } from '../../services/canvas-service/canvas.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-draw-canvas',
  templateUrl: './draw-canvas.component.html',
  styleUrls: ['./draw-canvas.component.scss'],
})
export class DrawCanvasComponent implements AfterViewInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();

  @ViewChild('drawCanvas') canvasElement!: ElementRef;
  @ViewChild('inputElement') inputElement!: ElementRef;

  constructor(private readonly canvasService: CanvasService) {}

  ngAfterViewInit(): void {
    this.canvasService.canvas$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(canvas => {
        const colorsRGB = canvas.content.map(index => this.toRgb(index));

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

  updateData() {
    const values = this.inputElement.nativeElement.value
      .split(',')
      .map((value: string) => parseInt(value));
    this.canvasService.updatePixel(values[0], values[1], values[2]);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private toRgb(colorIndex: number): string {
    let r = 0;
    let g = 0;
    let b = 0;
    switch (colorIndex) {
      case 0:
        r = 255;
        g = 255;
        b = 255;
        break;
      case 2:
        r = 255;
        g = 0;
        b = 0;
        break;
    }
    return 'rgba(' + r + ',' + g + ',' + b + ', 1)';
  }
}
