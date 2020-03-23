import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../shared/authentication-service';
import {User} from '../shared/user.model';
import {ToastService} from '../shared/toast-service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss', '../app.component.scss'],
})

export class RegistrationPage implements OnInit {
    password: string;
    confirmPassword: string;
    user: User;

  constructor(
      public authService: AuthenticationService,
      public router: Router,
      public toastService: ToastService,
  ) {
      this.password = '';
      this.confirmPassword = '';
      this.user = new User();
  }

  ngOnInit() {
  }

  signUp() {
      const {password, confirmPassword} = this;
      if (password !== confirmPassword) {
          this.toastService.create('Passwords are different');
      }

      this.authService.RegisterUser(this.user, this.password)
      .then((res) => {
        // Do something here
        this.authService.SendVerificationMail();
        this.router.navigate(['verify-email']);
      }).catch((error) => {
          this.toastService.create('Ups! Something happened: ' + error);
      });
  }

}
