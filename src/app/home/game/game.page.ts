import { Component } from '@angular/core';
import {MatchService} from '../../shared/match-service';
import {UserService} from '../../shared/user-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  styleUrls: ['game.page.scss', '../../app.component.scss']
})
export class GamePage {

  matchesActive = [];
  matchesFinished: object[];
  loaded = false;

  constructor(private matchService: MatchService,
              private userService: UserService,
              private router: Router) {
    this.matchesActive = matchService.matchesActive;
    this.matchesFinished = matchService.matchesFinished;
    this.loaded = true;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  isWinner(match) {
    if (match.isFinish && match.localWin) {
      return true;
    } else {
      return false;
    }
  }

  isLoser(match) {
    if (match.isFinish && !match.localWin) {
      return true;
    } else {
      return false;
    }
  }

}
