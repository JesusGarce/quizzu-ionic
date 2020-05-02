import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss', '../../app.component.scss'],
})
export class NotificationsPage implements OnInit {

  constructor(private router: Router,
              private modalController: ModalController,
              private navParams: NavParams) { }

  ngOnInit() {}

  async closeNotifications() {
    await this.modalController.dismiss();
  }

  clearNotifications() {

  }

}
