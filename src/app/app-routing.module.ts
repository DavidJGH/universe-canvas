import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanvasPageComponent } from './components/canvas-page/canvas-page.component';
import { AdminPageComponent } from './components/admin/admin-page/admin-page.component';

const routes: Routes = [
  { path: '', component: CanvasPageComponent },
  { path: 'admin', component: AdminPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
