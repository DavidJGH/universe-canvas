import {Component, HostListener, OnInit} from '@angular/core';
import {CanvasService} from "../../services/canvas-service/canvas.service";

@Component({
  selector: 'app-scalable-container',
  templateUrl: './scalable-container.component.html',
  styleUrls: ['./scalable-container.component.scss'],
})
export class ScalableContainerComponent implements OnInit {

  xPosition = 0.0;
  yPosition = 0.0;
  scale = 1.0;

  scaleFactor = 2;

  maxScale = 40;
  minScale = 0.5;

  ngOnInit(): void {
    const center = this.getScreenCenter();
    this.xPosition = center.x - CanvasService.WIDTH / 2;
    this.yPosition = center.y - CanvasService.HEIGHT / 2;
  }

  @HostListener('wheel', ['$event'])
  scroll($event: WheelEvent) {
    const previousScale = this.scale;
    if ($event.deltaY > 0) {
      this.scale = Math.max(this.scale / this.scaleFactor, this.minScale);
    }
    else if ($event.deltaY < 0) {
      this.scale = Math.min(this.scale * this.scaleFactor, this.maxScale);
    }

    const scaleChange = this.scale / previousScale;

    const centerX = this.xPosition + CanvasService.WIDTH / 2;
    const centerY = this.yPosition + CanvasService.HEIGHT / 2;

    this.setPosition(
        $event.clientX - ($event.clientX - centerX) * scaleChange - CanvasService.WIDTH / 2,
        $event.clientY - ($event.clientY - centerY) * scaleChange - CanvasService.HEIGHT / 2);
  }

  @HostListener('mousemove', ['$event'])
  move($event: MouseEvent) {
    if ($event.buttons == 1) {
      this.setPosition(this.xPosition + $event.movementX, this.yPosition + $event.movementY)
    }
  }

  private setPosition(x: number, y: number) {
    const center = this.getScreenCenter();
    this.xPosition = Math.min(center.x + (CanvasService.WIDTH * (this.scale - 1)) / 2, Math.max(center.x - (CanvasService.WIDTH * (this.scale + 1)) / 2, x));
    this.yPosition = Math.min(center.y + (CanvasService.HEIGHT * (this.scale - 1)) / 2, Math.max(center.y - (CanvasService.HEIGHT * (this.scale + 1)) / 2, y));
  }

  private getScreenCenter(): {x: number, y: number} {
    return {x: window.innerWidth / 2, y: window.innerHeight / 2};
  }

}
