import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../shared/authentication-service';
import {UserService} from '../shared/user-service';
import {MatchService} from '../shared/match-service';
import {Router} from '@angular/router';
import {NotificationService} from '../shared/notification-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', '../app.component.scss']
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
