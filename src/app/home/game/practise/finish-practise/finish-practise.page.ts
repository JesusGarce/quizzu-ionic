import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../../shared/authentication-service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../shared/user-service';
import {MatchService} from '../../../../shared/match-service';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-finish-practise',
  templateUrl: './finish-practise.page.html',
  styleUrls: ['./finish-practise.page.scss', '../../../../app.component.scss'],
})
export class FinishPractisePage implements OnInit {
  public lottieConfig: object;
  private anim: any;
  public user: any;
  private level: string;
  public record: number;

  constructor(private authService: AuthenticationService,
              private router: Router,
              private userService: UserService,
              private matchService: MatchService,
              private navParams: NavParams,
              private route: ActivatedRoute,
              private modalController: ModalController) {
    this.lottieConfig = {
      path: './assets/animations/perchick_record_practise.json',
      autoplay: true,
      loop: true
    };
    this.user = this.userService.getCurrentUser();
    this.level = this.navParams.data.level;
    this.record = this.navParams.data.record;
  }

  ngOnInit() {}

  handleAnimation(anim: any) {
    this.anim = anim;
  }

  async closeModal() {
    await this.modalController.dismiss();
    this.router.navigate(['home/game']).then();
  }

}
