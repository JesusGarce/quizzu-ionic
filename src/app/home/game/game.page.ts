import { Component } from '@angular/core';
import {MatchService} from '../../shared/match-service';
import {UserService} from '../../shared/user-service';
import {Router} from '@angular/router';
import {UserMin} from '../../shared/user-min.model';

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

  goToFriendsPage() {
    this.router.navigate(['home/friends']);
  }

  createMatchWithoutOponent() {
    this.matchService.createNewMatch('b2', new UserMin('', '')).then(
        res => {
          console.log('MATCH: ' + res);
        }, error => {
          console.log('ERROR: ' + error.toString());
        }
    );
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
