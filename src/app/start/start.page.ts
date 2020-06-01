import { Component } from '@angular/core';
import {AuthenticationService} from '../shared/authentication-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'start.page.html',
  styleUrls: ['start.page.scss', '../app.component.scss'],
})
export class StartPage {

  constructor(
      public authService: AuthenticationService,
      private router: Router
  ) {
    if (this.authService.isLoggedIn)
      this.router.navigate(['home/game']).then();
  }

}
