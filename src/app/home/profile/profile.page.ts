import {Component} from '@angular/core';
import {AuthenticationService} from '../../shared/authentication-service';
import {Router} from '@angular/router';
import {EditImageProfileComponent} from './edit-image-profile.component';
import {AlertController, ModalController, PopoverController} from '@ionic/angular';
import {UserService} from '../../shared/user-service';
import {NotificationsPage} from '../notifications/notifications.page';
import {NotificationService} from '../../shared/notification-service';
import {SettingsPage} from './settings/settings.page';

@Component({
    selector: 'app-profile',
    templateUrl: 'profile.page.html',
    styleUrls: ['profile.page.scss', '../../app.component.scss']
})
export class ProfilePage {
    matchesWon: number;
    matchesDraw: number;
    matchesLost: number;
    user: any;
    userStats: any;

    constructor(
        private authService: AuthenticationService,
        private router: Router,
        private popoverController: PopoverController,
        private userService: UserService,
        private modalController: ModalController,
        private notificationService: NotificationService) {
        this.user = this.userService.getCurrentUser();
        this.userStats = this.userService.getCurrentUserStats();

        this.matchesWon = this.userStats.c2level.c2won + this.userStats.c1level.c1won +
            this.userStats.b2level.b2won + this.userStats.b1level.b1won;
        this.matchesDraw = this.userStats.c2level.c2draw + this.userStats.c1level.c1draw +
            this.userStats.b2level.b2draw + this.userStats.b1level.b1draw;
        this.matchesLost = this.userStats.c2level.c2lost + this.userStats.c1level.c1lost +
            this.userStats.b2level.b2lost + this.userStats.b1level.b1lost;

        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    async editImagePopover() {
        const popover = await this.popoverController.create({
            component: EditImageProfileComponent
        });

        popover.onDidDismiss().then(() => {
            this.router.navigate(['/home/profile']);
        });
        return await popover.present();
    }

    async openNotifications() {
        const modal = await this.modalController.create({
            component: NotificationsPage,
            componentProps: {}
        });
        modal.onDidDismiss().then(() => {
        });
        return await modal.present();
    }

    async openSettings() {
        const modal = await this.modalController.create({
            component: SettingsPage,
            componentProps: {}
        });
        modal.onDidDismiss().then(() => {
        });
        return await modal.present();
    }

    isAnyNotification() {
        return this.notificationService.getNotificationListLength() === 0;
    }

    isNotificationsEnabled() {
        return this.userService.isNotificationsEnabled();
    }

    notificationLength() {
        return this.notificationService.notificationList.length;
    }

    goToEditProfile() {
        this.router.navigate(['home/profile/edit']);
    }

    logout() {
        this.authService.signOut();
    }
}
