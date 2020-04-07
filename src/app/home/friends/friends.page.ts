import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {UserService} from '../../shared/user-service';
import {ToastService} from '../../shared/toast-service';
import {Router} from '@angular/router';
import {UserMin} from '../../shared/user-min.model';
import {SearchModalUserPage} from './search-modal-user/search-modal-user.page';
import {MatchService} from '../../shared/match-service';

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

  constructor(
      private alertController: AlertController,
      private userService: UserService,
      private toast: ToastService,
      private router: Router,
      private modalController: ModalController,
      private matchService: MatchService
  ) {
    this.friendRequests = userService.currentUser.friendRequests;
    this.friends = userService.currentUser.friends;
  }

  ngOnInit() {
    this.friendRequests = this.userService.currentUser.friendRequests;
    this.friends = this.userService.currentUser.friends;
  }

  searchUsers() {
    this.userService.searchUser(this.findUser).then(
        resp => {
          this.items = [];
          for (const user of resp.docs.values()) {
              if (user.data().id !== this.userService.currentUser.id)
                this.items.push(new UserMin(user.data().id, user.data().username));
          }
          this.openModal();
        }
    );
  }

  startGameAgainst(friend) {
    this.matchService.createNewMatch('b2', friend).then(
        res => {
          console.log('MATCH: ' + res);
        }, error => {
          console.log('ERROR: ' + error.toString());
        }
    );
  }

  acceptRequest(friendRequest) {
    this.userService.acceptFriendRequest(friendRequest).then(
        res => {
          this.toast.create('Now ' + friendRequest.username.toString() + ' is your friend!');
          this.friendRequests = this.userService.currentUser.friendRequests;
          this.friends = this.userService.currentUser.friends;
        }, error => {
          this.toast.create('Ups! Something happened, try later.');
        }
    );
  }

  goToProfilePage(friendRequest) {
    const url = 'home/user/' + friendRequest.id;
    this.router.navigate([url]);
  }

  async deleteRequest(friendRequest) {
    console.log('delete Request');
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: 'Do you want to <strong>delete</strong> this friend request?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.userService.removeFriendRequest(friendRequest).then(
                res => {
              this.toast.create('You has deleted a friend request');
              this.friendRequests = this.userService.currentUser.friendRequests;
            }, error => {
              this.toast.create('Ups! Something happened, try later.');
            });
            console.log('Confirm Okay');
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

        modal.onDidDismiss().then((dataReturned) => {});

        return await modal.present();
    }

  async confirmNewGame() {
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: 'Do you want to <strong>start</strong> a new game?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }
}
