import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../../shared/authentication-service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../shared/user-service';
import {SpinnerLoadingService} from '../../../shared/spinner-loading/spinner-loading.service';
import {MatchService} from '../../../shared/match-service';
import {CountdownStartPage} from './countdown-start/countdown-start.page';
import {ModalController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss', '../../../app.component.scss'],
})
export class MatchPage implements OnInit {

  match: any;
  loaded = false;
  numberQuestion: number;
  counter: any;
  less5seconds = false;
  user: any;
  words: string[];
  correctWord: string;

  constructor( private authService: AuthenticationService,
               private router: Router,
               private userService: UserService,
               private matchService: MatchService,
               private route: ActivatedRoute,
               private modalController: ModalController,
               private spinnerLoading: SpinnerLoadingService,
               private http: HttpClient) {
    this.user = this.userService.currentUser;
    this.matchService.getMatch(this.route.snapshot.paramMap.get('id')).then(doc => {
      if (doc.exists) {
        this.spinnerLoading.hide();
        this.match = doc.data();
        this.initializeWords(this.match.gameLevel);
        this.loaded = true;
        this.counter = 15;
        if (this.match.player1.id === this.user.id) {
          this.numberQuestion = 16 - this.match.player1RemainsQuestions;
        } else {
          this.numberQuestion = 16 - this.match.player2RemainsQuestions;
        }
      } else {
        this.spinnerLoading.hide();
        return false;
      }
    }).catch(() => {
      this.spinnerLoading.hide();
      return false;
    });
  }

  ngOnInit() {
    this.startCountdown().then();
  }

  startTimer() {
    const intervalId = setInterval(() => {
      this.counter --;
      if (this.counter === 5) {
        this.less5seconds = true;
      }
      if (this.counter === 0) clearInterval(intervalId);
    }, 1000);
  }

  async startCountdown() {
    const modal = await this.modalController.create({
      component: CountdownStartPage,
    });

    modal.onDidDismiss().then(() => {
      this.startTimer();
    });

    return await modal.present();
  }

  initializeWords(level) {
    this.words = [];
    const url = 'assets/docs/wordlist_' + level + '.json';
    this.http.get(url, {responseType: 'json'})
        .subscribe(data => {
          this.findFourRandomWords(data);
        });
  }

  findFourRandomWords(wordlist) {
    const arrayNumbers = [];
    const correctWord = this.randomWord(1, 4);
    while (arrayNumbers.length < 4) {
      const randomNumber = this.randomWord(0, wordlist.length);
      if (!arrayNumbers.includes(randomNumber)) {
        arrayNumbers.push(randomNumber);
        this.words.push(wordlist.words[randomNumber]);
        if (correctWord === arrayNumbers.length) {
          this.correctWord = wordlist.words[randomNumber];
          console.log('Correct word: ' + this.correctWord);
        }
      }
    }
  }

  randomWord(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
