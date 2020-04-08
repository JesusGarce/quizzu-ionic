import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-select-level-modal',
  templateUrl: './select-level-modal.page.html',
  styleUrls: ['./select-level-modal.page.scss' , '../../../app.component.scss'],
})
export class SelectLevelModalPage implements OnInit {

  constructor(
      private modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  async closeModal(level) {
    await this.modalController.dismiss(level);
  }

}
