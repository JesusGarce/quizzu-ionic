import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../shared/authentication-service';
import {Router} from '@angular/router';
import {SpinnerLoadingService} from '../../../shared/spinner-loading/spinner-loading.service';
import {ToastService} from '../../../shared/toast-service';
import {UserService} from '../../../shared/user-service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss', '../../../app.component.scss'],
})
export class EditProfilePage implements OnInit {
  password: string;
  confirmPassword: string;
  currentPassword: string;
  user: any;

  constructor(
      private authService: AuthenticationService,
      private router: Router,
      private spinnerLoading: SpinnerLoadingService,
      private toastService: ToastService,
      private userService: UserService
  ) {
      this.user = this.userService.currentUser;
  }

  ngOnInit() {
  }

  editUser() {
    this.spinnerLoading.show();
    this.userService.setCurrentUser(this.user).then(
        success => {
            this.toastService.create('Your profile has changed successfully.');
            this.spinnerLoading.hide();
            this.router.navigate(['home/profile']);
        },
        error => {
            this.toastService.create('Ups! Something bad happened. Try later.');
            this.spinnerLoading.hide();
        }
    );
  }

  changePassword() {
      if (this.password.length < 8) {
          return this.toastService.create('Password should have 8 characters or more.');
      }
      if (this.password !== this.confirmPassword) {
          return this.toastService.create('Passwords are not the same');
      }

      this.spinnerLoading.show();
      this.authService.checkCurrentPassword(this.currentPassword).then(
        success => {
            this.authService.setPassword(this.password).then(
                resp => {
                    this.toastService.create('Password has been changed successfully');
                    this.spinnerLoading.hide();
                    this.router.navigate(['home/profile']);
                }
            );
        },
        error => {
          this.spinnerLoading.hide();
          console.log(error);
          if (error.code === 'auth/wrong-password') {
              this.toastService.create('Current password is incorrect. Try again');
          }
          if (error.code === 'auth/too-many-request') {
              this.toastService.create('Too many requests. Wait a few minutes to try it again.');
          }
        });
  }

}
