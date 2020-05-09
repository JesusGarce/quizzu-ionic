import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../../shared/authentication-service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../shared/user-service';
import {MatchService} from '../../../../shared/match-service';
import {AlertController, ModalController, NavParams} from '@ionic/angular';
import {UserMin} from '../../../../shared/models/user-min.model';
import {Messages} from '../../../../shared/messages';
import {Options} from '../../../../shared/models/options.model';

@Component({
  selector: 'app-search-opponent',
  templateUrl: './search-opponent.page.html',
  styleUrls: ['./search-opponent.page.scss', '../../../../app.component.scss'],
})
export class SearchOpponentPage implements OnInit {

  public lottieConfig: object;
  private anim: any;
  private searching = true;
  private creating = false;
  private created = false;
  private found = false;
  private options: Options;
  private user: any;

  constructor(private authService: AuthenticationService,
              private router: Router,
              private userService: UserService,
              private matchService: MatchService,
              private navParams: NavParams,
              private route: ActivatedRoute,
              private modalController: ModalController,
              private alertController: AlertController) {
    this.lottieConfig = {
      path: './assets/animations/loading_perchick.json',
      autoplay: true,
      loop: true
    };
    this.options = new Options(this.navParams.data.options.type, this.navParams.data.options.level);
    this.doSearch();
  }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
  }

  handleAnimation(anim: any) {
    this.anim = anim;
  }

  doSearch() {
    this.matchService.findFreeMatch(this.options).then(
        matches => {
          if (matches.empty) {
            this.showCreating();
            this.created = true;
            this.matchService.createNewMatch(this.options, new UserMin('', '', ''))
                .then(
                    () => {
                      this.showSearching();
                    });
          } else {
            let found = false;
            for (const match of matches.docs.values()) {
              if (match.data().player1.id !== this.user.id) {
                found = true;
                const matchFound = match.data();
                matchFound.player2 = new UserMin(this.user.id, this.user.username, this.user.profile);
                matchFound.matchAccepted = true;
                this.matchService.saveMatch(matchFound, match.id)
                    .then(
                        () => {
                          this.showFound();
                          this.matchService.createMatchDataShow(matchFound, match.id, this.user.id, true);
                          this.delay(2000).then(
                              () => {
                                this.checkIfIsCurrentPlayerTurn(matchFound, match.id);
                              });
                        }
                    );
                break;
              }
            }
            if (!found) {
              this.created = true;
              this.matchService.createNewMatch(this.options, new UserMin('', '', ''))
                  .then(
                      () => {
                        this.showSearching();
                      }
                  );
            }
          }
        }
    );
  }

  async exitSearchOpponent() {
    const alert = await this.alertController.create({
      header: Messages.CLOSE_SEARCHING_TITLE,
      message: Messages.CLOSE_SEARCHING,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Yes',
          handler: () => {
            this.closeModal();
          }
        }
      ]
    });

    await alert.present();
  }

  private showCreating() {
    this.searching = false;
    this.found = false;
    this.creating = true;
  }

  private showFound() {
    this.searching = false;
    this.found = true;
    this.creating = false;
  }

  private showSearching() {
    this.searching = true;
    this.found = false;
    this.creating = false;
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then();
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  private checkIfIsCurrentPlayerTurn(matchFound, id) {
    this.closeModal();
    if (matchFound.player1Turn && (matchFound.player1.username === this.user.username)) {
      const url = 'home/game/match/' + id;
      this.router.navigate([url]).then();
    }
  }
}
