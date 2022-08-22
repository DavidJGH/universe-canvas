import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { Canvas } from '../../models/canvas.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  private canvasBehaviorSubject = new BehaviorSubject<Canvas>({
    width: 0,
    height: 0,
    content: [],
  });

  canvas$ = this.canvasBehaviorSubject.asObservable();

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
  }

  updatePixel(x: number, y: number, c: number) {
    this.hubConnection?.send('SetPixel', x, y, c);
  }
}
