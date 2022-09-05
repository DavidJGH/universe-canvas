import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { DrawCanvasComponent } from './components/draw-canvas/draw-canvas.component';
import { ScalableContainerComponent } from './components/scalable-container/scalable-container.component';
import { HttpClientModule } from '@angular/common/http';
import { PaletteComponent } from './components/palette/palette.component';
import { ConnectionDisplayComponent } from './components/connection-display/connection-display.component';
import { AppRoutingModule } from './app-routing.module';
import { CanvasPageComponent } from './components/canvas-page/canvas-page.component';
import { AdminPageComponent } from './components/admin/admin-page/admin-page.component';
import { AdminConfigurationComponent } from './components/admin/admin-configuration/admin-configuration.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ColorPickerModule } from 'ngx-color-picker';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    DrawCanvasComponent,
    ScalableContainerComponent,
    PaletteComponent,
    ConnectionDisplayComponent,
    CanvasPageComponent,
    AdminPageComponent,
    AdminConfigurationComponent,
    AdminLoginComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    DragDropModule,
    ColorPickerModule,
    // AngularFireModule.initializeApp(environment.firebase),
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideAnalytics(() => getAnalytics()),
    // provideAuth(() => getAuth()),
    // provideFirestore(() => getFirestore()),
    // providePerformance(() => getPerformance()),
  ],
  providers: [ScreenTrackingService, UserTrackingService, CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
