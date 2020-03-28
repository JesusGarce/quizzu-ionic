import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../shared/authentication-service';
import {Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../../shared/user-service';
import {SpinnerLoadingService} from '../../shared/spinner-loading/spinner-loading.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss', '../../app.component.scss'],
})
export class UserPage implements OnInit {
  user: any;
  loaded = false;

  constructor(
      private authService: AuthenticationService,
      private router: Router,
      private userService: UserService,
      private route: ActivatedRoute,
      private spinnerLoading: SpinnerLoadingService,
  ) {
    this.user = this.userService.getUser(this.route.snapshot.paramMap.get('id')).then(doc => {
      if (doc.exists) {
        this.spinnerLoading.hide();
        this.user = doc.data();
        this.loaded = true;
      } else {
        this.spinnerLoading.hide();
        return false;
      }
    }).catch(err => {
      this.spinnerLoading.hide();
      return false;
    });
    console.log(this.user);
  }

  ngOnInit() {
  }

}
