import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  static WIDTH = 20;
  static HEIGHT = 20;

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly firestore: AngularFirestore
  ) {}

  public updateCanvasContinuously(canvas: HTMLCanvasElement): void {
    const context = canvas.getContext('2d');

    this.firestore
      .doc<{ width: number; height: number; content: string }>(
        '/canvas/uvXsZg1YPNaDhAtpxTcK'
      )
      .valueChanges()
      .subscribe(document => {
        if (document) {
          CanvasService.WIDTH = document.width;
          CanvasService.HEIGHT = document.height;

          canvas.width = CanvasService.WIDTH;
          canvas.height = CanvasService.HEIGHT;

          const content = document.content;
          const base_image = new Image();
          base_image.onload = function () {
            if (context) {
              context.drawImage(base_image, 0, 0);
            }
          };
          base_image.src = content;

          // const colorsRGB = colorsIndices.map((index) => this.toRgb(index));
          //
          // if (context) {
          //   for(var i=0; i< CanvasService.WIDTH; i++){
          //     for(var j=0; j< CanvasService.HEIGHT; j++){
          //       context.fillStyle = colorsRGB[i+j*CanvasService.WIDTH];
          //       context.fillRect( i, j, 1, 1 );
          //     }
          //   }
          // }
        }
      });
  }

  // private toRgb(colorIndex: number): string {
  //   let r = 0;
  //   let g = 0;
  //   let b = 0;
  //   switch (colorIndex) {
  //     case 0:
  //       r = 255;
  //       g = 255;
  //       b = 255;
  //       break;
  //     case 2:
  //       r = 255;
  //       g = 0;
  //       b = 0;
  //       break;
  //   }
  //   return 'rgba('+r+','+g+','+b+', 1)';
  // }
}
