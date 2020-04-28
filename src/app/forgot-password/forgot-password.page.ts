import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../shared/authentication-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss', '../app.component.scss'],
})
export class ForgotPasswordPage implements OnInit {

  constructor(
      private authService: AuthenticationService,
      public router: Router) {}

  ngOnInit() {}

  forgotPassword(email) {
    this.authService.passwordRecover(email.value).then(
        () => {
          this.router.navigate(['/login']);
        }
    );
  }

}
