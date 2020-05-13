import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../authentication-service';
import {UserService} from '../user-service';
import {MatchService} from '../match-service';
import {Router} from '@angular/router';
import {NotificationService} from '../notification-service';

@Component({
  selector: 'app-home',
  templateUrl: '../../home/home.page.html',
  styleUrls: ['../../home/home.page.scss', '../../app.component.scss']
})
export class HomePage {

  constructor(
      private authService: AuthenticationService,
      private userService: UserService,
      private matchService: MatchService,
      private notificationService: NotificationService,
      private router: Router
  ) {
    if (!this.authService.isLoggedIn)
      this.router.navigate(['start']).then();
  }

}
