import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../shared/authentication-service';
import {ToastController} from '@ionic/angular';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import {UserService} from '../shared/user-service';
import {ToastService} from '../shared/toast-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss', '../app.component.scss'],
})

export class LoginPage implements OnInit {

  constructor(
      public authService: AuthenticationService,
      public router: Router,
      public fb: Facebook,
      private userService: UserService,
      private toast: ToastService,
    ) {}

  ngOnInit() {}

  logIn(email, password) {
    this.authService.signInWithEmailAndPassword(email.value, password.value)
      .then((res) => {
        if (res.user.emailVerified) {
          this.userService.initCurrentUser(res.user.uid);
          this.userService.initCurrentUserStats(res.user.uid);
          this.router.navigate(['home']);
        } else {
          this.toast.create('You should verify your e-mail');
        }
      }).catch(() => {
        this.toast.create('Ups! Something happened');
      });
  }

  logInFacebook() {
    this.fb.login(['email'])
        .then((response: FacebookLoginResponse) => {
          this.authService.facebookAuth(response);
          console.log(response.authResponse.accessToken);
        }).catch((error) => {
          this.toast.create('Error: ' + error);
    });
  }

  goToForgotPassword() {
    this.router.navigate(['forgot-password']);
  }

}
