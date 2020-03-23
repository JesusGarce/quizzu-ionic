import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../shared/authentication-service';
import {ToastController} from '@ionic/angular';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import {UserService} from '../shared/user-service';

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
      public toastController: ToastController,
      private userService: UserService,
    ) {}

  ngOnInit() {}

  logIn(email, password) {
    this.authService.SignIn(email.value, password.value)
      .then((res) => {
        if (this.authService.isEmailVerified) {
          this.userService.initCurrentUser(res.user.uid);
          this.userService.initCurrentUserStats(res.user.uid);
          this.router.navigate(['home']);
        } else {
          this.toastEmailNotVerified();
          return false;
        }
      }).catch((error) => {
        this.toastError();
      });
  }

  logInFacebook() {
    this.fb.login(['email'])
        .then((response: FacebookLoginResponse) => {
          this.authService.FacebookAuth(response);
          console.log(response.authResponse.accessToken);
        }).catch((error) => {
      console.log(error);
      alert('error:' + error);
    });
  }

  async toastError() {
    const toast = await this.toastController.create({
      message: 'Ups! Something happened',
      duration: 2000
    });
    await toast.present();
  }

  async toastEmailNotVerified() {
    const toast = await this.toastController.create({
      message: 'You should verify your e-mail',
      duration: 2000
    });
    await toast.present();
  }

}
