import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { distinctUntilChanged, map, tap } from 'rxjs';
import { Canvas, ColorChangeInfo } from '../../../models/canvas.model';
import { CanvasService } from '../../../services/canvas-service/canvas.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AdminService } from '../../../services/admin-service/admin.service';

@Component({
  selector: 'app-admin-configuration',
  templateUrl: './admin-configuration.component.html',
  styleUrls: [
    '../admin-interface.scss',
    './admin-configuration.component.scss',
  ],
})
export class AdminConfigurationComponent {
  canvasData$ = this.canvasService.canvas$.pipe(
    map(({ canvas }) => {
      const canvasData: Omit<Canvas, 'content'> = canvas;
      return canvasData;
    }),
    distinctUntilChanged(),
    tap(canvas => {
      this.resetPalette(canvas.palette, canvas.startColor);
    })
  );

  currentPalette: ColorChangeInfo[] = [];
  currentStartColor = -1;

  currentlyOpenIsStartColor = false;
  currentlyCheckboxValue = false;

  @Input()
  token!: string;

  constructor(
    private readonly canvasService: CanvasService,
    private readonly adminService: AdminService,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  removeColor(index: number) {
    this.currentPalette.splice(index, 1);
  }

  resetPalette(palette: string[], startColor: number) {
    this.currentStartColor = startColor;
    this.currentPalette = palette.map((color, index) => ({
      originalIndex: index,
      color: color,
    }));
  }

  colorMoved($event: CdkDragDrop<string, any>) {
    const element = this.currentPalette[$event.previousIndex];
    this.currentPalette.splice($event.previousIndex, 1);
    this.currentPalette.splice($event.currentIndex, 0, element);
    if ($event.previousIndex == this.currentStartColor) {
      this.currentStartColor = $event.currentIndex;
    } else if (
      $event.previousIndex < this.currentStartColor &&
      $event.currentIndex >= this.currentStartColor
    ) {
      this.currentStartColor--;
    } else if (
      $event.previousIndex > this.currentStartColor &&
      $event.currentIndex <= this.currentStartColor
    ) {
      this.currentStartColor++;
    }
  }

  addColor(color: string) {
    this.currentPalette.push({ originalIndex: -1, color });
  }

  updateColor(index: number, color: string) {
    this.currentPalette[index].color = color;
    if (this.currentlyCheckboxValue && index != this.currentStartColor) {
      this.currentStartColor = index;
    }
  }

  submitPalette() {
    this.adminService.updatePalette(
      this.currentPalette,
      this.currentStartColor,
      this.token
    );
  }

  openPicker(index: number) {
    this.currentlyOpenIsStartColor = true;
    this.changeDetector.detectChanges();
    this.currentlyOpenIsStartColor = index === this.currentStartColor;
    this.currentlyCheckboxValue = this.currentlyOpenIsStartColor;
  }

  checkboxChanged($event: Event) {
    this.currentlyCheckboxValue = ($event.target as HTMLInputElement).checked;
  }
}
