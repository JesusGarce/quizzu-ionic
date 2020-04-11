import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../../shared/authentication-service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../shared/user-service';
import {MatchService} from '../../../../shared/match-service';
import {AlertController, ModalController, NavParams} from '@ionic/angular';
import {SpinnerLoadingService} from '../../../../shared/spinner-loading/spinner-loading.service';
import {UserMin} from '../../../../shared/user-min.model';

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
  private level: string;

  constructor(private authService: AuthenticationService,
              private router: Router,
              private userService: UserService,
              private matchService: MatchService,
              private navParams: NavParams,
              private route: ActivatedRoute,
              private modalController: ModalController,
              private alertController: AlertController,
              private spinnerLoading: SpinnerLoadingService) {
    this.lottieConfig = {
      path: './assets/animations/18143-discord-nearby-animation.json',
      autoplay: true,
      loop: true
    };
    this.level = this.navParams.data.level;
    this.doSearch();
  }

  ngOnInit() {
  }

  handleAnimation(anim: any) {
    this.anim = anim;
  }

  doSearch() {
    this.matchService.findFreeMatch(this.level).then(
        matches => {
          if (matches.empty) {
            this.showCreating();
            this.created = true;
            this.matchService.createNewMatch(this.level, new UserMin('', ''))
                .then(
                    match => {
                    this.showSearching();
                }, error => {}
            );
          } else {
            let found = false;
            for (const match of matches.docs.values()) {
              if (match.data().player1.id !== this.userService.currentUser.id) {
                found = true;
                const matchFound = match.data();
                matchFound.player2 = new UserMin(this.userService.currentUser.id, this.userService.getCurrentUsername());
                matchFound.matchAccepted = true;
                this.matchService.saveMatch(matchFound, match.id)
                    .then(
                        () => {
                          this.showFound();
                          this.matchService.createMatchDataShow(matchFound, match.id, this.userService.currentUser.id, true);
                          this.delay(300).then(
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
              this.matchService.createNewMatch(this.level, new UserMin('', ''))
                  .then(
                      match => {
                        this.showSearching();
                      }, error => {}
                  );
            }
          }
        }
    );
  }

  private checkIfIsCurrentPlayerTurn(matchFound, id) {
    if (matchFound.player1Turn && (matchFound.player1.username === this.userService.getCurrentUsername())) {
      this.closeModal();
      const url = 'home/game/match/' + id;
      this.router.navigate([url]).then();
    } else {
      this.closeModal();
    }
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

  async exitSearchOpponent() {
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: 'Do you want to <strong>close</strong> the search? We will notify you when we find a opponent ',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {}
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
}
