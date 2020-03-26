import { Component } from '@angular/core';
import {MatchService} from '../../shared/match-service';
import {UserService} from '../../shared/user-service';

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  styleUrls: ['game.page.scss', '../../app.component.scss']
})
export class GamePage {

  matchesActive = [];
  matchesFinished: object[];
  loaded = false;

  constructor(matchService: MatchService, userService: UserService) {
    this.matchesActive = matchService.matchesActive;
    this.matchesFinished = matchService.matchesFinished;
    this.loaded = true;
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
