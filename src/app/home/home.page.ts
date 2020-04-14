import { Component } from '@angular/core';
import {AuthenticationService} from '../shared/authentication-service';
import {UserService} from '../shared/user-service';
import {MatchService} from '../shared/match-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', '../app.component.scss']
})
export class HomePage {

  constructor(
      private authService: AuthenticationService,
      private userService: UserService,
      private matchService: MatchService
  ) {
    console.log('IS LOGGED IN: ' + this.authService.isLoggedIn);
  }

}
