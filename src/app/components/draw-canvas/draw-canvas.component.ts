import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {CanvasService} from "../../services/canvas-service/canvas.service";
import {helloWorld} from "../../../../functions/src";
import {AngularFireFunctions} from "@angular/fire/compat/functions";

@Component({
  selector: 'app-draw-canvas',
  templateUrl: './draw-canvas.component.html',
  styleUrls: ['./draw-canvas.component.scss']
})
export class DrawCanvasComponent implements AfterViewInit{

  @ViewChild('drawCanvas') canvas!: ElementRef;

  constructor(private readonly canvasService: CanvasService, private readonly fireFunctions: AngularFireFunctions) {
  }

  ngAfterViewInit(): void {
    this.canvasService.updateCanvasContinuously(this.canvas.nativeElement)
    const myFunction = this.fireFunctions.httpsCallable('helloWorld');
    myFunction({}).subscribe((result) => console.log(result));
  }

}
