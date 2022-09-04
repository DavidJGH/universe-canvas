import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
})
export class AdminPageComponent {
  authenticated = false;
  token = '';

  handleAuthenticated(token: string) {
    this.authenticated = true;
    this.token = token;
  }
}
