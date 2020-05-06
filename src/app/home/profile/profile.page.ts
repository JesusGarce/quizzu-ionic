import {Component} from '@angular/core';
import {AuthenticationService} from '../../shared/authentication-service';
import {Router} from '@angular/router';
import {EditImageProfileComponent} from './edit-image-profile.component';
import {AlertController, ModalController, PopoverController} from '@ionic/angular';
import {UserService} from '../../shared/user-service';
import {NotificationsPage} from '../notifications/notifications.page';
import {NotificationService} from '../../shared/notification-service';

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
    notificationsEnabled: boolean;

    constructor(
        private authService: AuthenticationService,
        private router: Router,
        private popoverController: PopoverController,
        private userService: UserService,
        private modalController: ModalController,
        private notificationService: NotificationService,
        private alertController: AlertController,
    ) {
        this.user = this.userService.currentUser;
        this.userStats = this.userService.getCurrentUserStats();
        this.notificationsEnabled = this.userService.isNotificationsEnabled();

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

    async changeNotifications() {
        if (this.userService.isNotificationsEnabled()) {
            const alert = await this.alertController.create({
                header: 'Disable notifications',
                message: 'Do you want to <strong>disable</strong> the notifications?',
                buttons: [
                    {
                        text: 'No',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => {
                            this.notificationsEnabled = true;
                        }
                    }, {
                        text: 'Yes',
                        handler: () => {
                            this.userService.setNotificationsEnabled();
                        }
                    }
                ]
            });

            await alert.present();
        } else {
            this.userService.setNotificationsEnabled();
        }
    }

}
