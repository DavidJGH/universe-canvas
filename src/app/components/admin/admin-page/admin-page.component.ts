import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AdminService } from '../../../services/admin-service/admin.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
})
export class AdminPageComponent implements OnInit {
  authenticated = -1;
  token = '';

  cookieName = 'admin-user';

  constructor(
    private readonly cookieService: CookieService,
    private readonly adminService: AdminService
  ) {}

  ngOnInit() {
    if (this.cookieService.check(this.cookieName)) {
      const cookieToken = this.cookieService.get(this.cookieName);
      this.adminService.isValidToken(cookieToken).subscribe(valid => {
        if (valid) {
          this.handleAuthenticated(cookieToken);
        } else {
          this.cookieService.delete(this.cookieName);
        }
      });
    } else {
      this.authenticated = 0;
    }
  }

  handleAuthenticated(token: string) {
    this.authenticated = 1;
    this.token = token;

    if (!this.cookieService.check(this.cookieName)) {
      const expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + 3 * 60 * 60 * 1000);
      this.cookieService.set(this.cookieName, token, {
        expires: expirationDate,
      });
    }
  }
}
