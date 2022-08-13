import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {CanvasService} from "../../services/canvas-service/canvas.service";

@Component({
  selector: 'app-draw-canvas',
  templateUrl: './draw-canvas.component.html',
  styleUrls: ['./draw-canvas.component.scss']
})
export class DrawCanvasComponent implements AfterViewInit{

  @ViewChild('drawCanvas') canvas!: ElementRef;

  canvasContext: CanvasRenderingContext2D | null = null;

  constructor(private readonly canvasService: CanvasService) {
  }

  ngAfterViewInit(): void {
    this.canvasService.updateCanvasContinuously(this.canvas.nativeElement)
  }

}
