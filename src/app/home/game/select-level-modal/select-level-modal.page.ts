import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {ToastService} from '../../../shared/toast-service';
import {Constants} from '../../../shared/constants';
import {Messages} from '../../../shared/messages';
import {Options} from '../../../shared/models/options.model';

@Component({
  selector: 'app-select-level-modal',
  templateUrl: './select-level-modal.page.html',
  styleUrls: ['./select-level-modal.page.scss' , '../../../app.component.scss'],
})
export class SelectLevelModalPage implements OnInit {

  selection: Options;

  constructor(
      private modalController: ModalController,
      private toast: ToastService,
  ) {
    this.selection = new Options('', '');
  }

  ngOnInit() {
  }

  selectLevel(level) {
    this.selection.setLevel(level);
  }

  selectType(type) {
    this.selection.setType(type);
  }

  async startGame() {
    if ((this.selection.level !== '') && (this.selection.type !== ''))
      await this.modalController.dismiss(this.selection);
    else {
      this.toast.create(Messages.CHOOSE_LEVEL_AND_GAME);
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
