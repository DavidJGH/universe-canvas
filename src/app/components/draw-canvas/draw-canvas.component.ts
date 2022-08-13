import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {CanvasService} from "../../services/canvas-service/canvas.service";
import {IMAGE_HEIGHT, IMAGE_WIDTH} from "../../config/config";

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
    this.canvasContext = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.width = IMAGE_WIDTH;
    this.canvas.nativeElement.height = IMAGE_HEIGHT;
    this.canvasService.getCanvasImageObservable().subscribe((url) => {
      const context = this.canvasContext;
      const base_image = new Image();
      base_image.onload = function(){
        if (context){
          context.drawImage(base_image, 0, 0);
        }
      }
      base_image.src = url;
      console.log(base_image)
    });
  }

}
