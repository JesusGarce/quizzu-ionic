import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../shared/authentication-service';
import {Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../../shared/user-service';
import {SpinnerLoadingService} from '../../shared/spinner-loading/spinner-loading.service';
import {UserMin} from '../../shared/user-min.model';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss', '../../app.component.scss'],
})
export class UserPage implements OnInit {
  user: any;
  loaded = false;
  isFriend: boolean;
  isPending: boolean;

  constructor(
      private authService: AuthenticationService,
      private router: Router,
      private userService: UserService,
      private route: ActivatedRoute,
      private spinnerLoading: SpinnerLoadingService,
      public alertController: AlertController
  ) {
    this.isFriend = false;
    this.isPending = false;
    this.user = this.userService.getUser(this.route.snapshot.paramMap.get('id')).then(doc => {
      if (doc.exists) {
        this.spinnerLoading.hide();
        this.user = doc.data();
        this.loaded = true;
        this.checkCase();
      } else {
        this.spinnerLoading.hide();
        return false;
      }
    }).catch(err => {
      this.spinnerLoading.hide();
      return false;
    });

  }

  ngOnInit() {
    console.log('onInitUserPage');
  }

  sendRequest() {
    this.userService.sendFriendRequest(new UserMin(this.user.id, this.user.username));
    this.isPending = true;
  }

  deleteFriend() {
    this.userService.removeFriend(new UserMin(this.user.id, this.user.username));
    this.isFriend = false;
  }

  private checkCase() {
    if (this.user.id === this.userService.currentUser.id)
      this.router.navigate(['/home/profile']);

    if (this.user.friendRequests.find(friend => friend.id === this.userService.currentUser.id) !== undefined)
      this.isPending = true;

    if (this.userService.currentUser.friends.find(friend => friend.id === this.user.id) !== undefined)
        this.isFriend = true;
  }

  async deleteFriendDialog() {
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: 'Do you want to <strong>delete</strong> this friend?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Yes',
          handler: () => {
            this.deleteFriend();
          }
        }
      ]
    });

    await alert.present();
  }

}
