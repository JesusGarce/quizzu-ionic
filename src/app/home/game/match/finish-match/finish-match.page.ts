import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../../shared/authentication-service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../shared/user-service';
import {MatchService} from '../../../../shared/match-service';
import {AlertController, ModalController, NavParams} from '@ionic/angular';
import {Constants} from '../../../../shared/constants';

@Component({
  selector: 'app-finish-match',
  templateUrl: './finish-match.page.html',
  styleUrls: ['./finish-match.page.scss', '../../../../app.component.scss'],
})
export class FinishMatchPage implements OnInit {
  public lottieConfig: object;
  private anim: any;
  private user: any;
  private state: string;
  public victory: boolean;
  public defeat: boolean;
  public draw: boolean;
  public match: any;

  constructor(private authService: AuthenticationService,
              private router: Router,
              private userService: UserService,
              private matchService: MatchService,
              private navParams: NavParams,
              private route: ActivatedRoute,
              private modalController: ModalController) {
    this.user = this.userService.getCurrentUser();
    this.state = this.navParams.data.state;
    this.match = this.navParams.data.match;
    this.configLottie();
  }

  configLottie() {
    if (this.state === Constants.RESULT_GAME_VICTORY) {
      this.showVictory();
      this.lottieConfig = {
        path: './assets/animations/victory_perchick.json',
        autoplay: true,
        loop: true
      };
    } else if (this.state === Constants.RESULT_GAME_DEFEAT) {
      this.showDefeat();
      this.lottieConfig = {
        path: './assets/animations/defeat_perchick.json',
        autoplay: true,
        loop: true
      };
    } else {
      this.showDraw();
      this.lottieConfig = {
        path: './assets/animations/draw_perchick.json',
        autoplay: true,
        loop: true
      };
    }
  }

  ngOnInit() {}

  handleAnimation(anim: any) {
    this.anim = anim;
  }

  private showVictory() {
    this.victory = true;
    this.defeat = false;
    this.draw = false;
  }

  private showDefeat() {
    this.victory = false;
    this.defeat = true;
    this.draw = false;
  }

  private showDraw() {
    this.victory = false;
    this.defeat = false;
    this.draw = true;
  }

  async closeModal() {
    await this.modalController.dismiss();
    this.router.navigate(['home/game']).then();
  }
}
