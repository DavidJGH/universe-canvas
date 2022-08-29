import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { Canvas, PartialCanvas } from '../../models/canvas.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  private canvasBehaviorSubject = new BehaviorSubject<Canvas>({
    width: 0,
    height: 0,
    content: [],
    palette: [],
  });

  private selectedColorIndexBehaviorSubject = new BehaviorSubject<number>(0);

  canvas$ = this.canvasBehaviorSubject.asObservable();

  selectedColorIndex$ = this.selectedColorIndexBehaviorSubject.asObservable();

  private hubConnection: signalR.HubConnection | undefined;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.backendBase + '/canvasHub')
      .build();
    this.hubConnection
      .start()
      .then(() => {
        this.hubConnection?.invoke('GetCanvas').then((data: Canvas) => {
          this.canvasBehaviorSubject.next(data);
        });
      })
      .catch(err => console.log('Error while starting connection: ' + err));
    this.hubConnection.on('TransferCompleteCanvas', (data: Canvas) => {
      this.canvasBehaviorSubject.next(data);
    });
    this.hubConnection.on('TransferCanvasChanges', (data: PartialCanvas) => {
      const canvas = this.canvasBehaviorSubject.value;
      for (let pixelInfo of data.content) {
        if (
          pixelInfo.position.x >= canvas.width ||
          pixelInfo.position.y >= canvas.height
        ) {
          continue;
        }
        canvas.content[
          pixelInfo.position.y * canvas.width + pixelInfo.position.x
        ] = pixelInfo.colorIndex;
      }
      this.canvasBehaviorSubject.next(canvas);
    });
  }

  updatePixel(x: number, y: number, c: number) {
    this.hubConnection?.send('SetPixel', x, y, c);
  }

  setColorIndex(index: number) {
    this.selectedColorIndexBehaviorSubject.next(index);
  }
}
