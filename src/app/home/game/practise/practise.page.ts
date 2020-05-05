import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../shared/authentication-service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../shared/user-service';
import {MatchService} from '../../../shared/match-service';
import {PointsService} from '../match/points.service';
import {MatchWordsApiService} from '../match/wordsapi-service/match-wordsapi-service';
import {ModalController} from '@ionic/angular';
import {SpinnerLoadingService} from '../../../shared/spinner-loading/spinner-loading.service';
import {ToastService} from '../../../shared/toast-service';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../../../shared/constants';
import {CountdownStartPage} from '../match/countdown-start/countdown-start.page';
import {Word} from '../match/wordsapi-service/word.model';
import {Messages} from '../../../shared/messages';

@Component({
  selector: 'app-practise',
  templateUrl: './practise.page.html',
  styleUrls: ['./practise.page.scss', '../../../app.component.scss'],
})
export class PractisePage implements OnInit {
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
  displayAnswer = false;
  answer: number;
  consecutives: number;

  constructor(private authService: AuthenticationService,
              private router: Router,
              private userService: UserService,
              private matchService: MatchService,
              private pointsService: PointsService,
              private matchWordsApiService: MatchWordsApiService,
              private route: ActivatedRoute,
              private modalController: ModalController,
              private spinnerLoading: SpinnerLoadingService,
              private toast: ToastService,
              private http: HttpClient) {
    this.user = this.userService.currentUser;
    this.initData();
  }

  ngOnInit() {
    this.startCountdown().then();
  }

  initData() {
    this.wordsButtonOK = [];
    this.wordsButtonFail = [];
    this.initializeWords('b2');
    this.answerDone = false;
    this.displayAnswer = false;
    this.counter = Constants.TIME_QUESTION;
    this.numberQuestion = 1;
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.counter --;
      if (this.counter === 5) {
        this.less5seconds = true;
      }
      if (this.counter === 0) return true;
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
    this.correctWordPosition = this.randomWord(1, Constants.QUESTIONS);
    while (arrayNumbers.length < Constants.QUESTIONS) {
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
    /*
    this.matchWordsApiService.getDefinition(this.correctWord)
        .subscribe((data: Word) => {
          this.question = data.definitions[0].definition;
        }, error => {
          console.log('Error: ' + error);
          this.initializeWords(this.match.gameLevel);
        });
     */
  }

  doingAnswer(answer) {
    this.answer = answer;
    this.answerDone = true;
    clearInterval(this.interval);
    this.less5seconds = false;
    this.wordsButtonOK[this.correctWordPosition] = true;
    this.checkAnswer();
  }

  checkAnswer() {
    if (!this.isCorrectAnswer())
      this.wordsButtonFail[this.answer] = true;
    else
      this.consecutives ++;

    this.displayAnswer = true;
  }

  randomWord(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then();
  }

  isCorrectAnswer() {
    return this.correctWordPosition === this.answer;
  }
}
