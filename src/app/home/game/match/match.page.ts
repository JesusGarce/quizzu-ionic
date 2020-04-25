import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../../shared/authentication-service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../shared/user-service';
import {SpinnerLoadingService} from '../../../shared/spinner-loading/spinner-loading.service';
import {MatchService} from '../../../shared/match-service';
import {CountdownStartPage} from './countdown-start/countdown-start.page';
import {ModalController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import {MatchWordsApiService} from './wordsapi-service/match-wordsapi-service';
import {ToastService} from '../../../shared/toast-service';
import {Word} from './wordsapi-service/word.model';
import {SearchOpponentPage} from './search-opponent/search-opponent.page';
import {FinishMatchPage} from './finish-match/finish-match.page';

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
  wordsButtonOK: boolean[];
  wordsButtonFail: boolean[];
  correctWord: string;
  correctWordPosition: number;
  answerDone = false;
  question: string;
  interval: any;

  constructor( private authService: AuthenticationService,
               private router: Router,
               private userService: UserService,
               private matchService: MatchService,
               private matchWordsApiService: MatchWordsApiService,
               private route: ActivatedRoute,
               private modalController: ModalController,
               private spinnerLoading: SpinnerLoadingService,
               private toast: ToastService,
               private http: HttpClient) {
    this.user = this.userService.currentUser;
    this.matchService.getMatch(this.route.snapshot.paramMap.get('id')).then(doc => {
      if (doc.exists) {
        this.spinnerLoading.hide();
        this.match = doc.data();
        this.initData();
      } else {
        this.spinnerLoading.hide();
        return false;
      }
    }).catch(() => {
      this.spinnerLoading.hide();
      return false;
    });
  }

  initData() {
    if (!(this.match.player1Turn && (this.match.player1.id === this.user.id)) &&
        !(!this.match.player1Turn && (this.match.player2.id === this.user.id))) {
      this.toast.create('Is not your turn yet, you have to wait until your opponent plays');
      this.modalController.dismiss().then();
      this.router.navigate(['home/game']).then();
    }

    this.wordsButtonOK = [];
    this.wordsButtonFail = [];
    this.initializeWords(this.match.gameLevel);
    this.loaded = true;
    this.counter = 15;
    if (this.match.player1.id === this.user.id) {
      this.numberQuestion = 16 - this.match.player1RemainsQuestions;
    } else {
      this.numberQuestion = 16 - this.match.player2RemainsQuestions;
    }
  }

  ngOnInit() {
    this.startCountdown().then();
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.counter --;
      if (this.counter === 5) {
        this.less5seconds = true;
      }
      if (this.counter === 0) this.checkAnswer(this.correctWordPosition);
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
    this.correctWordPosition = this.randomWord(1, 4);
    while (arrayNumbers.length < 4) {
      const randomNumber = this.randomWord(0, wordlist.length);
      if (!arrayNumbers.includes(randomNumber)) {
        arrayNumbers.push(randomNumber);
        this.words.push(wordlist.words[randomNumber]);
        if (this.correctWordPosition === arrayNumbers.length) {
          this.correctWord = wordlist.words[randomNumber];
          this.getQuestion();
        }
      }
    }
  }

  getQuestion() {
    this.matchWordsApiService.getDefinition(this.correctWord)
        .subscribe((data: Word) => {
          this.question = data.definitions[0].definition;
        });
  }

  checkAnswer(answer) {
    clearInterval(this.interval);
    this.less5seconds = false;
    this.wordsButtonOK[this.correctWordPosition] = true;
    this.answerDone = true;
    if (this.correctWordPosition !== answer)
      this.wordsButtonFail[answer] = true;
    this.matchService.saveResultsTurn(this.match, this.route.snapshot.paramMap.get('id'),
        this.counter, this.correctWordPosition === answer).then(
            () => {
                this.delay(2000).then(
                  () => {
                    if (this.matchService.checkIfMatchIsFinished(this.match))
                      this.finishGame().then();
                    else
                      this.router.navigate(['home/game']).then();
                  });
            }).catch(() => {
                this.toast.create('We can not save the question. Try later');
            });
  }

  randomWord(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then();
  }

  getStateFinishMatch() {
    if (this.match.winnerId === this.user.id)
      return 'victory';
    else if (this.match.winnerId !== '')
      return 'defeat';
    else
      return 'draw';
  }

  async finishGame() {
    this.match = this.matchService.getCurrentMatch();
    const modal = await this.modalController.create({
      component: FinishMatchPage,
      componentProps: {
        state: this.getStateFinishMatch(),
        match: this.match
      }
    });

    modal.onDidDismiss().then(() => {});

    return await modal.present();
  }
}
