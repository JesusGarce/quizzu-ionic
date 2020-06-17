import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../shared/services/authentication-service';
import {User} from '../../shared/models/user.model';
import {ToastService} from '../../shared/services/toast-service';
import {Messages} from '../../shared/messages';
import {UserService} from '../../shared/services/user-service';
import {SpinnerLoadingService} from '../../shared/spinner-loading/spinner-loading.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss', '../../app.component.scss'],
})

export class RegistrationPage implements OnInit {
    password: string;
    confirmPassword: string;
    user: User;

  constructor(
      public authService: AuthenticationService,
      public router: Router,
      public toast: ToastService,
      public userService: UserService,
      private spinnerLoading: SpinnerLoadingService,
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
      this.userService.existUser(this.user.username).then(
          u => {
              if (u.empty) {
                  this.authService.registerUser(this.user, this.password)
                      .then(() => {})
                      .catch(err => {
                      this.spinnerLoading.hide();
                      this.toast.create(Messages.ERROR + ':' + err);
                  });
              } else {
                  this.toast.create(Messages.EXIST_USERNAME);
                  this.spinnerLoading.hide();
              }
          });
  }

}
