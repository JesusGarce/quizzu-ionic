import {Component, OnInit} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {UserService} from '../../shared/user-service';
import {ToastService} from '../../shared/toast-service';
import {Router} from '@angular/router';
import {UserMin} from '../../shared/user-min.model';

@Component({
  selector: 'app-friends',
  templateUrl: 'friends.page.html',
  styleUrls: ['friends.page.scss', '../../app.component.scss']
})
export class FriendsPage implements OnInit  {
  isItemAvailable = false;
  items: string[];
  friendRequests: UserMin[];
  friends: UserMin[];

  constructor(
      private alertController: AlertController,
      private userService: UserService,
      private toast: ToastService,
      private router: Router
  ) {
    this.friendRequests = userService.currentUser.friendRequests;
    this.friends = userService.currentUser.friends;
  }

  ngOnInit() {
    console.log('OnInit');
    this.friendRequests = this.userService.currentUser.friendRequests;
    this.friends = this.userService.currentUser.friends;
  }

  initializeItems() {
    this.items = ['Ram', 'gopi', 'dravid'];
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
      this.isItemAvailable = true;
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
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
