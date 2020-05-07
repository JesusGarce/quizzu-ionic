import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {ToastService} from '../../../shared/toast-service';
import {Constants} from '../../../shared/constants';

@Component({
  selector: 'app-select-level-modal',
  templateUrl: './select-level-modal.page.html',
  styleUrls: ['./select-level-modal.page.scss' , '../../../app.component.scss'],
})
export class SelectLevelModalPage implements OnInit {

  selection: any;

  constructor(
      private modalController: ModalController,
      private toast: ToastService,
  ) {
    this.selection = {};
    this.selection.type = '';
    this.selection.level = '';
  }

  ngOnInit() {
  }

  selectLevel(level) {
    this.selection.level = level;
  }

  selectType(type) {
    this.selection.type = type;
  }

  async startGame() {
    if ((this.selection.level !== '') && (this.selection.type !== ''))
      await this.modalController.dismiss(this.selection);
    else {
      this.toast.create('You should choose a level and game before start');
    }
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  isC2Level() {
    return this.selection.level === Constants.LEVEL_C2;
  }

  isC1Level() {
    return this.selection.level === Constants.LEVEL_C1;
  }

  isB2Level() {
    return this.selection.level === Constants.LEVEL_B2;
  }

  isB1Level() {
    return this.selection.level === Constants.LEVEL_B1;
  }

  isDefinitionMode() {
    return this.selection.type === Constants.GAME_DEFINITIONS;
  }

  isSynonymMode() {
    return this.selection.type === Constants.GAME_SYNONYMS;
  }

  isAntonymMode() {
    return this.selection.type === Constants.GAME_ANTONYMS;
  }

}
