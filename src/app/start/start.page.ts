import { Component } from '@angular/core';
import {AuthenticationService} from '../shared/authentication-service';

@Component({
  selector: 'app-home',
  templateUrl: 'start.page.html',
  styleUrls: ['start.page.scss', '../app.component.scss'],
})
export class StartPage {

  constructor(
      public authService: AuthenticationService,
  ) {}

}
