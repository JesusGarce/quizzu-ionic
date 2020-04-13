import {Component} from '@angular/core';
import {MatchService} from '../../shared/match-service';
import {UserService} from '../../shared/user-service';
import {Router} from '@angular/router';
import {AlertController, ModalController} from '@ionic/angular';
import {SelectLevelModalPage} from './select-level-modal/select-level-modal.page';
import {MatchShow} from '../../shared/match-show.model';
import {ToastService} from '../../shared/toast-service';
import {SearchOpponentPage} from './match/search-opponent/search-opponent.page';

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  styleUrls: ['game.page.scss', '../../app.component.scss']
})
export class GamePage {

  levelMatch: string;
  matchFoundId: string;
  matchesActive: MatchShow[];
  matchesFinished: MatchShow[];
  matchesPending: MatchShow[];
  loaded = false;

  constructor(private matchService: MatchService,
              private userService: UserService,
              private alertController: AlertController,
              private router: Router,
              private toast: ToastService,
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

  async chooseLevel() {
    const modal = await this.modalController.create({
      component: SelectLevelModalPage,
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.levelMatch = dataReturned.data;
        this.searchingOpponent();
      }
    });

    return await modal.present();
  }

  async searchingOpponent() {
    const modal = await this.modalController.create({
      component: SearchOpponentPage,
      componentProps: {
        level: this.levelMatch
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.matchFoundId = dataReturned.data;

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

  async leftGameStarted(game) {
    const alert = await this.alertController.create({
      header: 'Do you give up?',
      message: 'Do you want to <strong>leave</strong> this game?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Yes',
          handler: () => {
            this.matchService.leaveGameStarted(game).then(
                () => {
                  this.matchesActive = this.matchesActive.filter( p => p.id !== game.id);
                  this.matchesFinished.push(game);
                }, () => {
                }
            );
          }
        }
      ]
    });

    await alert.present();
  }

  goToMatch(match) {
    const url = 'home/game/match/' + match.id;
    this.router.navigate([url]);
  }

  isWinner(match) {
    return match.isFinish && match.localWin;
  }

  isLoser(match) {
    return match.isFinish && !match.localWin;
  }

  youCanPlay(match) {
    return ((match.turnLocalPlayer) && (match.matchAccepted));
  }
}
