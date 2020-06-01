import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../shared/authentication-service';
import {Router} from '@angular/router';
import {SpinnerLoadingService} from '../../../shared/spinner-loading/spinner-loading.service';
import {ToastService} from '../../../shared/toast-service';
import {UserService} from '../../../shared/user-service';
import {Messages} from '../../../shared/messages';

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
        this.user = this.userService.getCurrentUser();
    }

    ngOnInit() {
    }

    editUser() {
        this.spinnerLoading.show();
        this.userService.setCurrentUser(this.user).then(
            () => {
                this.toastService.create(Messages.PROFILE_CHANGED);
                this.spinnerLoading.hide();
                this.router.navigate(['home/profile']);
            }, () => {
                this.toastService.create(Messages.ERROR);
                this.spinnerLoading.hide();
            }
        );
    }

    changePassword() {
        if (this.password.length < 8) {
            return this.toastService.create(Messages.PROFILE_PASSWORD_LENGTH_ERROR);
        }
        if (this.password !== this.confirmPassword) {
            return this.toastService.create(Messages.PROFILE_DIFFERENT_PASSWORDS);
        }

        this.spinnerLoading.show();
        this.authService.checkCurrentPassword(this.currentPassword).then(
            () => {
                this.authService.setPassword(this.password).then(
                    () => {
                        this.toastService.create(Messages.PROFILE_PASSWORD_CHANGED);
                        this.spinnerLoading.hide();
                        this.router.navigate(['home/profile']);
                    }
                );
            },
            error => {
                this.spinnerLoading.hide();
                if (error.code === 'auth/wrong-password') {
                    this.toastService.create(Messages.PROFILE_PASSWORD_INCORRECT);
                }
                if (error.code === 'auth/too-many-request') {
                    this.toastService.create(Messages.PROFILE_PASSWORD_TOO_MANY_REQUESTS);
                }
            });
    }

    closeEditProfile() {
        this.router.navigate(['home/profile']);
    }
}
