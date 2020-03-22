import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../shared/authentication-service';
import { ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {EditImageProfileComponent} from '../edit-image-profile.component';
import { PopoverController, NavParams} from '@ionic/angular';
import {Observable} from 'rxjs';
import {SpinnerLoadingService} from '../../../shared/spinner-loading/spinner-loading.service';

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
      private toastController: ToastController,
      private router: Router,
      private spinnerLoading: SpinnerLoadingService,
  ) {
    this.user = this.authService.currentUser;
  }

  ngOnInit() {
  }

  editUser() {
    this.spinnerLoading.show();
    this.authService.setCurrentUser(this.user).then(
        success => {
          this.toastSuccessEdit().then();
          this.spinnerLoading.hide();
          this.router.navigate(['home/profile']);
        },
        error => {
          return this.toastErrorEdit();
        }
    );
  }

  changePassword() {
    if (this.password.length < 8)
      return this.toastErrorLength();
    if (this.password !== this.confirmPassword)
      return this.toastErrorConfirm();

    this.spinnerLoading.show();
    this.authService.checkCurrentPassword(this.currentPassword).then(
        success => {
            this.authService.setPassword(this.password).then(
                resp => {
                  this.toastSuccessPassword().then();
                  this.spinnerLoading.hide();
                  this.router.navigate(['home/profile']);
                }
            );
        },
        error => {
          this.spinnerLoading.hide();
          console.log(error);
          if (error.code === 'auth/wrong-password') {
            return this.toastErrorCurrent();
          }
          if (error.code === 'auth/too-many-request') {
            return this.toastErrorTooManyRequest();
          }
        });
  }

  async toastErrorLength() {
    const toast = await this.toastController.create({
      message: 'Minimum length for a password is 8',
      duration: 2000
    });
    await toast.present();
  };

  async toastErrorCurrent() {
    const toast = await this.toastController.create({
      message: 'Current password is incorrect',
      duration: 2000
    });
    await toast.present();
  }

  async toastErrorTooManyRequest() {
    const toast = await this.toastController.create({
      message: 'Current password is incorrect',
      duration: 2000
    });
    await toast.present();
  }

  async toastErrorConfirm() {
    const toast = await this.toastController.create({
      message: 'Passwords are not the same',
      duration: 2000
    });
    await toast.present();
  }

  async toastErrorEdit() {
    const toast = await this.toastController.create({
      message: 'Ups! We could not this changes. Try later.',
      duration: 2000
    });
    await toast.present();
  }

  async toastSuccessPassword() {
    const toast = await this.toastController.create({
      message: 'Password changed successfully',
      duration: 2000
    });
    await toast.present();
  }

  async toastSuccessEdit() {
    const toast = await this.toastController.create({
      message: 'Information changed successfully',
      duration: 2000
    });
    await toast.present();
  }

}
