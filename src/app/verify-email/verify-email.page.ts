import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/authentication-service';
import {UserService} from '../shared/user-service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss', '../app.component.scss'],
})
export class VerifyEmailPage implements OnInit {

  constructor(
    public authService: AuthenticationService,
    public userService: UserService
  ) { }

  ngOnInit() {
  }

}
