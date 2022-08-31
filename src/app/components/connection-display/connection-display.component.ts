import { Component } from '@angular/core';
import { CanvasService } from '../../services/canvas-service/canvas.service';
import { ConnectionStatus } from '../../models/connection-status.model';
import { debounce, of, timer } from 'rxjs';

@Component({
  selector: 'app-connection-display',
  templateUrl: './connection-display.component.html',
  styleUrls: ['./connection-display.component.scss'],
})
export class ConnectionDisplayComponent {
  connectionStatus$ = this.canvasService.connectionStatus$.pipe(
    debounce(status => {
      switch (status) {
        case ConnectionStatus.CONNECTED:
          return timer(250);
        case ConnectionStatus.RECONNECTING:
          return timer(500);
        default:
          return of({});
      }
    })
  );

  constructor(private readonly canvasService: CanvasService) {}

  statusToText(connectionStatus: ConnectionStatus): string {
    switch (connectionStatus) {
      case ConnectionStatus.CONNECTING:
        return 'Connecting...';
      case ConnectionStatus.CONNECTED:
        return 'Connected';
      case ConnectionStatus.CONNECTION_LOST:
        return 'Connection Lost';
      case ConnectionStatus.RECONNECTING:
        return 'Reconnecting...';
    }
  }
}
