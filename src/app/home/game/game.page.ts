import {Component} from '@angular/core';
import {MatchService} from '../../shared/match-service';
import {UserService} from '../../shared/user-service';
import {Router} from '@angular/router';
import {AlertController, ModalController} from '@ionic/angular';
import {SelectLevelModalPage} from './select-level-modal/select-level-modal.page';
import {MatchShow} from '../../shared/match-show.model';
import {ToastService} from '../../shared/toast-service';
import {SearchOpponentPage} from './match/search-opponent/search-opponent.page';
import {Messages} from '../../shared/messages';
import {NotificationsPage} from '../notifications/notifications.page';
import {NotificationService} from '../../shared/notification-service';
import {Constants} from '../../shared/constants';

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
              private modalController: ModalController,
              private notificationService: NotificationService) {
    this.matchesActive = matchService.matchesActive;
    this.matchesFinished = matchService.matchesFinished;
    this.matchesPending = matchService.matchesPendings;
    this.loaded = true;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  goToFriendsPage() {
    this.router.navigate(['home/friends']);
  }

  async chooseLevel(gameMode) {
    const modal = await this.modalController.create({
      component: SelectLevelModalPage,
    });

    modal.onDidDismiss().then((dataReturned) => {
      console.log(dataReturned.data);
      if (dataReturned.data !== undefined) {
        this.levelMatch = dataReturned.data.level;
        if (gameMode === Constants.GAME_MODE_PRACTISE)
          this.startPractise(this.levelMatch);
        else
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

  startPractise(gameLevel) {
    this.router.navigate(['home/game/practise/' + gameLevel]).then();
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
      header: Messages.GIVE_UP_MATCH_TITLE,
      message: Messages.GIVE_UP_MATCH,
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
                });
          }
        }
      ]
    });

    await alert.present();
  }

  deleteMatchesFinished() {
    this.matchService.deleteMatchesFinished();
    this.matchesFinished = [];
    this.toast.create(Messages.HISTORY_DELETED);
  }

  goToMatch(match) {
    const matchToChange = this.matchesActive.filter( p => p.id === match.id).pop();
    matchToChange.turnLocalPlayer = !matchToChange.turnLocalPlayer;
    const url = 'home/game/match/' + match.id;
    this.router.navigate([url]);
  }

  isWinner(match) {
    return (match.localPlayerPoints > match.awayPlayerPoints);
  }

  isLoser(match) {
    return (match.localPlayerPoints < match.awayPlayerPoints);
  }

  isDrawn(match) {
    return (match.localPlayerPoints === match.awayPlayerPoints);
  }

  youCanPlay(match) {
    return ((match.turnLocalPlayer) && (match.matchAccepted));
  }

  async openNotifications() {
    const modal = await this.modalController.create({
      component: NotificationsPage,
      componentProps: {}
    });
    modal.onDidDismiss().then(() => {
    });
    return await modal.present();
  }
}
