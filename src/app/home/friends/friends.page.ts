import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {UserService} from '../../shared/user-service';
import {ToastService} from '../../shared/toast-service';
import {Router} from '@angular/router';
import {UserMin} from '../../shared/user-min.model';
import {SearchModalUserPage} from './search-modal-user/search-modal-user.page';
import {MatchService} from '../../shared/match-service';
import {SelectLevelModalPage} from '../game/select-level-modal/select-level-modal.page';
import {NotificationsPage} from '../notifications/notifications.page';
import {NotificationService} from '../../shared/notification-service';

@Component({
  selector: 'app-friends',
  templateUrl: 'friends.page.html',
  styleUrls: ['friends.page.scss', '../../app.component.scss']
})
export class FriendsPage implements OnInit  {
  items: UserMin[];
  friendRequests: UserMin[];
  friends: UserMin[];
  findUser: string;
  levelMatch: string;
  user: any;

  constructor(
      private alertController: AlertController,
      private userService: UserService,
      private toast: ToastService,
      private router: Router,
      private modalController: ModalController,
      private matchService: MatchService,
      private notificationService: NotificationService,
  ) {
    this.friendRequests = userService.getCurrentUser().friendRequests;
    this.friends = userService.getCurrentUser().friends;
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
      if (this.levelMatch !== null) {
          this.matchService.createNewMatch(this.levelMatch, friend);
      }
  }

  acceptRequest(friendRequest) {
    this.userService.acceptFriendRequest(friendRequest).then(
        () => {
          this.toast.create('Now ' + friendRequest.username.toString() + ' is your friend!');
          this.friendRequests = this.userService.currentUser.friendRequests;
          this.friends = this.userService.currentUser.friends;
          this.userService.acceptFriendRequestOtherUser(friendRequest);
        }, () => {
          this.toast.create('Ups! Something happened, try later.');
        }
    );
  }

  goToProfilePage(friendRequest) {
    const url = 'home/user/' + friendRequest.id;
    this.router.navigate([url]).then();
  }

  async deleteRequest(friendRequest) {
    const alert = await this.alertController.create({
      header: 'Delete friend request',
      message: 'Do you want to <strong>delete</strong> this friend request?',
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
              this.toast.create('You has deleted a friend request');
              this.friendRequests = this.userService.currentUser.friendRequests;
                }, () => {
              this.toast.create('Ups! Something happened, try later.');
            });
          }
        }
      ]
    });

    await alert.present();
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
      header: 'Start new game',
      message: 'Do you want to <strong>start</strong> a new game?',
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
                this.levelMatch = dataReturned.data;
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
}
