import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../shared/authentication-service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../shared/user-service';
import {SpinnerLoadingService} from '../../../shared/spinner-loading/spinner-loading.service';
import {MatchService} from '../../../shared/match-service';

@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss', '../../../app.component.scss'],
})
export class MatchPage implements OnInit {

  match: any;
  loaded = false;
  numberQuestion: number;
  counter: any;

  constructor( private authService: AuthenticationService,
               private router: Router,
               private userService: UserService,
               private matchService: MatchService,
               private route: ActivatedRoute,
               private spinnerLoading: SpinnerLoadingService) {
    this.matchService.getMatch(this.route.snapshot.paramMap.get('id')).then(doc => {
      if (doc.exists) {
        this.spinnerLoading.hide();
        this.match = doc.data();
        this.loaded = true;
        this.counter = 15;
        if (this.match.player1.id === userService.currentUser.id) {
          this.numberQuestion = 16 - this.match.player1RemainsQuestions;
        }
        else {
          this.numberQuestion = 16 - this.match.player2RemainsQuestions;
        }
      } else {
        this.spinnerLoading.hide();
        return false;
      }
    }).catch(err => {
      this.spinnerLoading.hide();
      return false;
    });
  }

  ngOnInit() {
    this.startTimer();

  }

  startTimer() {
    const intervalId = setInterval(() => {
      this.counter --;
      if (this.counter === 0) clearInterval(intervalId);
    }, 1000);
  }

}
