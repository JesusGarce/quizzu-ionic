import { Component } from '@angular/core';
import {AuthenticationService} from '../shared/authentication-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', '../app.component.scss']
})
export class HomePage {

  constructor(
      public authService: AuthenticationService
  ) {}

}
