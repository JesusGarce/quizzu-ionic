import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../shared/authentication-service';
import {Router} from '@angular/router';
import {PopoverController} from '@ionic/angular';
import {UserService} from '../shared/user-service';
import {Messages} from '../shared/messages';
import {SpinnerLoadingService} from '../shared/spinner-loading/spinner-loading.service';
import {ToastService} from '../shared/toast-service';

@Component({
  selector: 'app-enter-username',
  templateUrl: './enter-username.page.html',
  styleUrls: ['./enter-username.page.scss', '../app.component.scss'],
})
export class EnterUsernamePage implements OnInit {
  username: string;
  user: any;
  userStats: any;

  constructor(private authService: AuthenticationService,
              private router: Router,
              private popoverController: PopoverController,
              private toast: ToastService,
              private spinnerLoading: SpinnerLoadingService,
              private userService: UserService) {
    this.user = this.userService.getCurrentUser();
    this.userStats = this.userService.getCurrentUserStats();
  }

  ngOnInit() {
  }

  rewriteUsername() {
    this.spinnerLoading.show();
    this.userService.existUser(this.username).then(
        users => {
          if (users.empty) {
            const user = this.userService.getCurrentUser();
            user.username = this.username;
            this.userService.setCurrentUser(user).then(r => {
              this.spinnerLoading.hide();
              this.router.navigate(['home']);
            });
          } else {
            this.spinnerLoading.hide();
            this.toast.create(Messages.EXIST_USERNAME);
          }
        }, err => {
          this.toast.create(Messages.ERROR + ':' + err);
          this.spinnerLoading.hide();
        }
    );
  }
}
