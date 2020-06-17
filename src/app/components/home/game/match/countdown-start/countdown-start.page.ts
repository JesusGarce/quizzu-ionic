import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-countdown-start',
  templateUrl: './countdown-start.page.html',
  styleUrls: ['./countdown-start.page.scss', '../../../../../app.component.scss'],
})
export class CountdownStartPage implements OnInit {

  counter = 4;

  constructor(
      private modalController: ModalController) { }

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    setInterval(() => {
      this.counter --;
      if (this.counter === 0) this.closeModal();
    }, 1000);
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

}
