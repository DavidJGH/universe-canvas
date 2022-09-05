import { Component, EventEmitter, Output } from '@angular/core';
import { AdminService } from '../../../services/admin-service/admin.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['../admin-interface.scss', './admin-login.component.scss'],
})
export class AdminLoginComponent {
  @Output()
  authenticated = new EventEmitter<string>();

  showError = false;

  loginForm = this.formBuilder.group({
    username: '',
    password: '',
  });

  constructor(
    private readonly adminService: AdminService,
    private readonly formBuilder: FormBuilder
  ) {}

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const loginValue = this.loginForm.value;
    this.adminService
      .login(loginValue.username!, loginValue.password!)
      .subscribe(({ success, token }) => {
        if (success) {
          this.authenticated.emit(token);
        } else {
          this.showError = true;
        }
      });
  }
}
