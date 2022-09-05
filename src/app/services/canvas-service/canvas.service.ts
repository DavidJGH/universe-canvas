import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { Canvas, PartialCanvas } from '../../models/canvas.model';
import { environment } from '../../../environments/environment';
import { canvasToPartialCanvas } from '../../utils/canvas.utils';
import { ConnectionStatus } from '../../models/connection-status.model';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  private canvasBehaviorSubject = new BehaviorSubject<{
    canvas: Canvas;
    changes: PartialCanvas;
  }>({
    canvas: {
      width: 0,
      height: 0,
      content: [],
      palette: [],
      startColor: -1,
    },
    changes: {
      content: [],
    },
  });

  private selectedColorIndexBehaviorSubject = new BehaviorSubject<number>(0);

  private connectionStatusBehaviorSubject =
    new BehaviorSubject<ConnectionStatus>(ConnectionStatus.CONNECTING);

  canvas$ = this.canvasBehaviorSubject.asObservable();

  selectedColorIndex$ = this.selectedColorIndexBehaviorSubject.asObservable();

  connectionStatus$ = this.connectionStatusBehaviorSubject.asObservable();

  private hubConnection: signalR.HubConnection | undefined;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.backendBase + '/canvasHub')
      .withAutomaticReconnect([500, 1000, 2000, 2000, 5000, 5000, 10000, 30000])
      .build();
    this.connect().then(() => {
      this.connectionStatusBehaviorSubject.next(ConnectionStatus.CONNECTED);
      this.hubConnection?.invoke('GetCanvas').then((data: Canvas) => {
        this.canvasBehaviorSubject.next({
          canvas: data,
          changes: canvasToPartialCanvas(data),
        });
      });
    });

    this.hubConnection.onclose(() => {
      this.connectionStatusBehaviorSubject.next(
        ConnectionStatus.CONNECTION_LOST
      );
    });
    this.hubConnection.onreconnecting(() => {
      this.connectionStatusBehaviorSubject.next(
        ConnectionStatus.CONNECTION_LOST
      );
      this.connectionStatusBehaviorSubject.next(ConnectionStatus.RECONNECTING);
    });
    this.hubConnection.onreconnected(() => {
      this.connectionStatusBehaviorSubject.next(ConnectionStatus.CONNECTED);
    });

    this.hubConnection.on('TransferCompleteCanvas', (data: Canvas) => {
      this.canvasBehaviorSubject.next({
        canvas: data,
        changes: canvasToPartialCanvas(data),
      });
    });
    this.hubConnection.on('TransferCanvasChanges', (data: PartialCanvas) => {
      const canvas = this.canvasBehaviorSubject.value.canvas;
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
      this.canvasBehaviorSubject.next({
        canvas,
        changes: data,
      });
    });
  }

  updatePixel(x: number, y: number, c: number) {
    this.hubConnection?.send('SetPixel', x, y, c);
  }

  setColorIndex(index: number) {
    this.selectedColorIndexBehaviorSubject.next(index);
  }

  private connect(): Promise<void> {
    return this.hubConnection!.start().catch(() => {
      return new Promise(resolve => setTimeout(resolve.bind(null), 200)).then(
        () => this.connect()
      );
    });
  }
}
