import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../shared/user-service';
import {AlertController, ModalController} from '@ionic/angular';
import {NotificationService} from '../../../shared/notification-service';
import {NotificationsPage} from '../../notifications/notifications.page';
import {Messages} from '../../../shared/messages';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss', '../../../app.component.scss'],
})
export class SettingsPage implements OnInit {
  user: any;
  notificationsEnabled: boolean;

  constructor(private userService: UserService,
              private modalController: ModalController,
              private notificationService: NotificationService,
              private alertController: AlertController) {
    this.user = this.userService.getCurrentUser();
    this.notificationsEnabled = this.userService.isNotificationsEnabled();
  }

  ngOnInit() {
  }

  async changeNotifications() {
    if (this.userService.isNotificationsEnabled()) {
      const alert = await this.alertController.create({
        header: Messages.DISABLE_NOTIFICATIONS_TITLE,
        message: Messages.DISABLE_NOTIFICATIONS,
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

  async openNotifications() {
    const modal = await this.modalController.create({
      component: NotificationsPage,
      componentProps: {}
    });
    modal.onDidDismiss().then(() => {
    });
    return await modal.present();
  }

  closeSettings() {
    this.modalController.dismiss().then();
  }

}
