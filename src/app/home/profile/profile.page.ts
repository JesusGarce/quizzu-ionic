import { Component } from '@angular/core';
import {AuthenticationService} from '../../shared/authentication-service';
import {Router} from '@angular/router';
import {EditImageProfileComponent} from './edit-image-profile.component';
import {PopoverController} from '@ionic/angular';

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
      private popoverController: PopoverController
  ) {
    this.matchesWon = authService.currentUserStats.c2level.c2won + authService.currentUserStats.c1level.c1won +
        authService.currentUserStats.b2level.b2won + authService.currentUserStats.b1level.b1won;
    this.matchesDraw = authService.currentUserStats.c2level.c2draw + authService.currentUserStats.c1level.c1draw +
        authService.currentUserStats.b2level.b2draw + authService.currentUserStats.b1level.b1draw;
    this.matchesLost = authService.currentUserStats.c2level.c2lost + authService.currentUserStats.c1level.c1lost +
        authService.currentUserStats.b2level.b2lost + authService.currentUserStats.b1level.b1lost;

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
