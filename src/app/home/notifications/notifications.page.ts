import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ModalController, NavParams} from '@ionic/angular';
import {NotificationService} from '../../shared/notification-service';
import {UserService} from '../../shared/user-service';
import {Notification} from '../../shared/models/notification.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss', '../../app.component.scss'],
})
export class NotificationsPage implements OnInit {

  constructor(private router: Router,
              private modalController: ModalController,
              private notificationService: NotificationService,
              private userService: UserService) {}

  ngOnInit() {}

  async closeNotifications() {
    await this.modalController.dismiss();
  }

  clearNotifications() {
    this.notificationService.deleteAllNotificationsByUser();
  }

  deleteNotification(id) {
    this.notificationService.deleteNotification(id).then();
  }

}
