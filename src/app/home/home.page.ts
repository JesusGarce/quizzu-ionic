import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../shared/authentication-service';
import {UserService} from '../shared/user-service';
import {MatchService} from '../shared/match-service';
import {Router} from '@angular/router';
import {NotificationService} from '../shared/notification-service';
import {HttpClient} from '@angular/common/http';
import {ToastService} from '../shared/toast-service';
import {ServerService} from '../shared/server-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss', '../app.component.scss']
})
export class HomePage {

  constructor(
      private authService: AuthenticationService,
      private userService: UserService,
      private matchService: MatchService,
      private notificationService: NotificationService,
      private router: Router,
      private toast: ToastService,
      private http: HttpClient,
      private serverService: ServerService
  ) {
    this.serverService.checkIfIsNewDay();
  }

}
