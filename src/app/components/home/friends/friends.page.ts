import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {UserService} from '../../../shared/services/user-service';
import {ToastService} from '../../../shared/services/toast-service';
import {Router} from '@angular/router';
import {UserMin} from '../../../shared/models/user-min.model';
import {SearchModalUserPage} from './search-modal-user/search-modal-user.page';
import {MatchService} from '../../../shared/services/match-service';
import {SelectLevelModalPage} from '../game/select-level-modal/select-level-modal.page';
import {NotificationsPage} from '../notifications/notifications.page';
import {NotificationService} from '../../../shared/services/notification-service';
import {Options} from '../../../shared/models/options.model';
import {Messages} from '../../../shared/messages';

@Component({
  selector: 'app-friends',
  templateUrl: 'friends.page.html',
  styleUrls: ['friends.page.scss', '../../../app.component.scss']
})
export class FriendsPage implements OnInit  {
  items: UserMin[];
  findUser: string;
  options: Options;
  user: any;

  constructor(
      private alertController: AlertController,
      public userService: UserService,
      private toast: ToastService,
      private router: Router,
      private modalController: ModalController,
      private matchService: MatchService,
      private notificationService: NotificationService,
  ) {
    this.user = userService.getCurrentUser();
    this.findUser = '';
  }

  ngOnInit() {}

  searchUsers() {
    this.userService.searchUser(this.findUser).then(
        resp => {
          this.items = [];
          for (const user of resp.docs.values()) {
              if (user.data().id !== this.user.id)
                this.items.push(new UserMin(user.data().id, user.data().username, user.data().profile));
          }
          this.openModal();
        }
    );
  }

  startGameAgainst(friend) {
      if (this.options !== null) {
          this.matchService.createNewMatch(this.options, friend);
      }
  }

  acceptRequest(friendRequest) {
    this.userService.acceptFriendRequest(friendRequest).then(
        () => {
          this.toast.create('Now ' + friendRequest.username.toString() + ' is your friend!');
          this.userService.acceptFriendRequestOtherUser(friendRequest);
        }, () => {
          this.toast.create(Messages.ERROR);
        }
    );
  }

  goToProfilePage(friendRequest) {
    const url = 'home/user/' + friendRequest.id;
    this.router.navigate([url]).then();
  }

  async deleteRequest(friendRequest) {
    const alert = await this.alertController.create({
      header: Messages.DELETE_FRIEND_REQUEST_TITLE,
      message: Messages.DELETE_FRIEND_REQUEST,
        cssClass: 'alert',
        buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Yes',
          handler: () => {
            this.userService.removeFriendRequest(friendRequest).then(
                () => {
              this.toast.create(Messages.FRIEND_REQUEST_DELETED);
                }, () => {
              this.toast.create(Messages.ERROR);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  refreshFriends(event) {
      this.userService.initCurrentUser(this.userService.getCurrentUser().id);

      setTimeout(() => {
          event.target.complete();
      }, 2000);
  }

    async openModal() {
        const modal = await this.modalController.create({
            component: SearchModalUserPage,
            componentProps: {
                users: this.items
            }
        });
        modal.onDidDismiss().then(() => {
        });
        return await modal.present();
    }

  async confirmNewGame(friend) {
    const alert = await this.alertController.create({
      header: Messages.START_NEW_GAME_TITLE,
      message: Messages.START_NEW_GAME,
        cssClass: 'alert',
        buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Yes',
          handler: () => {
            this.chooseLevel(friend);
          }
        }
      ]
    });

    await alert.present();
  }

    async chooseLevel(friend) {
        const modal = await this.modalController.create({
            component: SelectLevelModalPage,
        });

        modal.onDidDismiss().then((dataReturned) => {
            if (dataReturned !== null) {
                this.options = dataReturned.data;
                this.startGameAgainst(friend);
            }
        });

        return await modal.present();
    }

    async openNotifications() {
        const modal = await this.modalController.create({
            component: NotificationsPage,
            componentProps: {}
        });
        modal.onDidDismiss().then(() => {
        });
        return await modal.present();
    }

    isAnyNotification() {
      return this.notificationService.getNotificationListLength() === 0;
    }

    isNotificationsEnabled() {
      return this.userService.isNotificationsEnabled();
    }

    notificationLength() {
      return this.notificationService.notificationList.length;
    }
}