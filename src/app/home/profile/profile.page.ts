import { Component } from '@angular/core';
import {AuthenticationService} from '../../shared/authentication-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss', '../../app.component.scss']
})
export class ProfilePage {

  constructor(
      private authService: AuthenticationService,
      private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

}
