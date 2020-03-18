import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/authentication-service';
import {User} from '../shared/user.model';
import {ToastController} from '@ionic/angular';

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
    public toastController: ToastController
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
          return console.error('Password does not match');
      }

      this.authService.RegisterUser(this.user, this.password)
      .then((res) => {
        // Do something here
        this.authService.SendVerificationMail();
        this.router.navigate(['verify-email']);
      }).catch((error) => {
          this.toastError();
      });
  }

    async toastError() {
        const toast = await this.toastController.create({
            message: 'Ups! Something happened',
            duration: 2000
        });
        await toast.present();
    }

}
