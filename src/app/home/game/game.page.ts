import { Component } from '@angular/core';
import {MatchService} from '../../shared/match-service';
import {UserService} from '../../shared/user-service';
import {Router} from '@angular/router';
import {UserMin} from '../../shared/user-min.model';
import {SearchModalUserPage} from '../friends/search-modal-user/search-modal-user.page';
import {ModalController} from '@ionic/angular';
import {SelectLevelModalPage} from './select-level-modal/select-level-modal.page';
import {MatchShow} from '../../shared/match-show.model';

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  styleUrls: ['game.page.scss', '../../app.component.scss']
})
export class GamePage {

  levelMatch: string;
  matchesActive: MatchShow[];
  matchesFinished: MatchShow[];
  matchesPending: MatchShow[];
  loaded = false;

  constructor(private matchService: MatchService,
              private userService: UserService,
              private router: Router,
              private modalController: ModalController) {
    this.matchesActive = matchService.matchesActive;
    this.matchesFinished = matchService.matchesFinished;
    this.matchesPending = matchService.matchesPendings;
    this.loaded = true;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  goToFriendsPage() {
    this.router.navigate(['home/friends']);
  }

  createMatchWithoutOponent() {
      if (this.levelMatch !== null) {
        this.matchService.createNewMatch(this.levelMatch, new UserMin('', '')).then(
            res => {
              console.log('MATCH: ' + res);
            }, error => {
              console.log('ERROR: ' + error.toString());
            }
        );
      }
  }

  async chooseLevel() {
    const modal = await this.modalController.create({
      component: SelectLevelModalPage,
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.levelMatch = dataReturned.data;
        this.createMatchWithoutOponent();
      }
    });

    return await modal.present();
  }

  acceptGame(game) {
    this.matchesPending = this.matchesPending.filter( p => p.id !== game.id);
    this.matchService.acceptMatchPending(game);
  }

  deleteGame(game) {
    this.matchesPending = this.matchesPending.filter( p => p.id !== game.id);
    this.matchService.deleteMatchPending(game);
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
