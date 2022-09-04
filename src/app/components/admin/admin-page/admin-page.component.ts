import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
})
export class AdminPageComponent {
  authenticated = true;
  token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibWFyYmxlcyIsIm5iZiI6MTY2MjMxMTUxMSwiZXhwIjoxNjYyMzE1MTExLCJpYXQiOjE2NjIzMTE1MTF9.LieiT-6D-dFxuKDmwG0uMJdiJdUjPmiP9yy2Ii5NNCk';

  handleAuthenticated(token: string) {
    this.authenticated = true;
    this.token = token;
    console.log(token);
  }
}
