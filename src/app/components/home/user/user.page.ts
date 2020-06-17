import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../shared/services/authentication-service';
import {Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../../../shared/services/user-service';
import {SpinnerLoadingService} from '../../../shared/spinner-loading/spinner-loading.service';
import {UserMin} from '../../../shared/models/user-min.model';
import {AlertController} from '@ionic/angular';
import {ToastService} from '../../../shared/services/toast-service';
import {User} from '../../../shared/models/user.model';
import {Messages} from '../../../shared/messages';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss', '../../../app.component.scss'],
})
export class UserPage implements OnInit {
  user: any;
  loaded = false;
  isFriend: boolean;
  isPending: boolean;
  currentUser: User;

  constructor(
      private authService: AuthenticationService,
      private router: Router,
      private userService: UserService,
      private route: ActivatedRoute,
      private spinnerLoading: SpinnerLoadingService,
      public alertController: AlertController,
      private toast: ToastService,
  ) {
    this.isFriend = false;
    this.isPending = false;
    this.currentUser = this.userService.getCurrentUser();
    this.userService.getUser(this.route.snapshot.paramMap.get('id')).then(doc => {
      if (doc.exists) {
        this.spinnerLoading.hide();
        this.user = doc.data();
        this.loaded = true;
        this.checkCase();
      } else {
        this.spinnerLoading.hide();
        return false;
      }
    }).catch(() => {
      this.spinnerLoading.hide();
      return false;
    });

  }

  ngOnInit() {}

  sendRequest() {
    this.userService.sendFriendRequest(new UserMin(this.user.id, this.user.username, this.user.profile));
    this.isPending = true;
  }

  deleteFriend() {
    const user = new UserMin(this.user.id, this.user.username, this.user.profile);
    this.userService.removeFriend(user).then(
        () => {
          this.toast.create(Messages.FRIEND_DELETED);
          this.userService.removeFriendOtherUser(user);
        }, () => {
          this.toast.create(Messages.ERROR);
        }
    );
    this.isFriend = false;
  }

  private checkCase() {
    if (this.user.id === this.currentUser.id)
      this.router.navigate(['/home/profile']);

    if (this.user.friendRequests.find(friend => friend.id === this.currentUser.id) !== undefined)
      this.isPending = true;

    if (this.currentUser.friends.find(friend => friend.id === this.user.id) !== undefined)
        this.isFriend = true;
  }

  async deleteFriendDialog() {
    const alert = await this.alertController.create({
      header: Messages.DELETE_FRIEND_TITLE,
      message: Messages.DELETE_FRIEND,
      cssClass: 'alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
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
