import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ModalController, NavParams} from '@ionic/angular';
import {UserMin} from '../../../shared/models/user-min.model';

@Component({
  selector: 'app-search-modal-user',
  templateUrl: './search-modal-user.page.html',
  styleUrls: ['./search-modal-user.page.scss', '../../../app.component.scss'],
})
export class SearchModalUserPage implements OnInit {

  modelData: UserMin[];

  constructor(private router: Router,
              private modalController: ModalController,
              private navParams: NavParams) { }

  ngOnInit() {
    this.modelData = this.navParams.data.users;
  }


  goToProfilePage(friendRequest) {
    const url = 'home/user/' + friendRequest.id;
    this.router.navigate([url]).then();
    this.closeModal().then();
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

}
