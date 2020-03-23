import {Component} from '@angular/core';
import {AuthenticationService} from '../../shared/authentication-service';
import {Router} from '@angular/router';
import {EditImageProfileComponent} from './edit-image-profile.component';
import {PopoverController} from '@ionic/angular';
import {UserService} from '../../shared/user-service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss', '../../app.component.scss']
})
export class ProfilePage {
  matchesWon: number;
  matchesDraw: number;
  matchesLost: number;

  constructor(
      private authService: AuthenticationService,
      private router: Router,
      private popoverController: PopoverController,
      private userService: UserService,
  ) {
    this.matchesWon = userService.currentUserStats.c2level.c2won + userService.currentUserStats.c1level.c1won +
        userService.currentUserStats.b2level.b2won + userService.currentUserStats.b1level.b1won;
    this.matchesDraw = userService.currentUserStats.c2level.c2draw + userService.currentUserStats.c1level.c1draw +
        userService.currentUserStats.b2level.b2draw + userService.currentUserStats.b1level.b1draw;
    this.matchesLost = userService.currentUserStats.c2level.c2lost + userService.currentUserStats.c1level.c1lost +
        userService.currentUserStats.b2level.b2lost + userService.currentUserStats.b1level.b1lost;

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  async editImagePopover() {
    const popover = await this.popoverController.create({
      component: EditImageProfileComponent
    });

    popover.onDidDismiss().then(() => {
      this.router.navigate(['/home/profile']);
    });
    return await popover.present();
  }

}
