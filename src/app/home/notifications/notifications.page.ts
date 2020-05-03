import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ModalController, NavParams} from '@ionic/angular';
import {NotificationService} from '../../shared/notification-service';
import {UserService} from '../../shared/user-service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss', '../../app.component.scss'],
})
export class NotificationsPage implements OnInit {

  constructor(private router: Router,
              private modalController: ModalController,
              private notificationService: NotificationService,
              private userService: UserService,
              private navParams: NavParams) { }

  ngOnInit() {
    this.notificationService.getNotificationsByUserId(this.userService.getCurrentUser().id);
  }

  async closeNotifications() {
    await this.modalController.dismiss();
  }

  clearNotifications() {

  }

}
