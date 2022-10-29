import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-canvas-page',
  templateUrl: './canvas-page.component.html',
  styleUrls: ['./canvas-page.component.scss'],
})
export class CanvasPageComponent {
  environment = environment;
}
