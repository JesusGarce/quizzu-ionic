import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../shared/authentication-service';
import {User} from '../shared/models/user.model';
import {ToastService} from '../shared/toast-service';
import {Messages} from '../shared/messages';

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
      public toast: ToastService,
  ) {
      this.password = '';
      this.confirmPassword = '';
      this.user = new User('', '', '', '');
  }

  ngOnInit() {
  }

  signUp() {
      const {password, confirmPassword} = this;
      if (password !== confirmPassword) {
          this.toast.create(Messages.PROFILE_DIFFERENT_PASSWORDS);
      }

      this.authService.registerUser(this.user, this.password)
      .then(() => {
        this.authService.sendVerificationMail();
        this.router.navigate(['verify-email']);
      }).catch(() => {
          this.toast.create(Messages.ERROR);
      });
  }

}
