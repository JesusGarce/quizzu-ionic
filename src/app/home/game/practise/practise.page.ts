import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../shared/authentication-service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../shared/user-service';
import {MatchService} from '../../../shared/match-service';
import {PointsService} from '../match/points.service';
import {MatchWordsApiService} from '../../../shared/match-wordsapi-service';
import {AlertController, ModalController} from '@ionic/angular';
import {SpinnerLoadingService} from '../../../shared/spinner-loading/spinner-loading.service';
import {ToastService} from '../../../shared/toast-service';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../../../shared/constants';
import {CountdownStartPage} from '../match/countdown-start/countdown-start.page';
import {Word} from '../../../shared/models/word.model';
import {Messages} from '../../../shared/messages';
import {FinishMatchPage} from '../match/finish-match/finish-match.page';
import {FinishPractisePage} from './finish-practise/finish-practise.page';
import {Options} from '../../../shared/models/options.model';
import {Antonyms} from '../../../shared/models/antonym.model';
import {Synonyms} from '../../../shared/models/synonym.model';
import {ServerService} from '../../../shared/server-service';

@Component({
  selector: 'app-practise',
  templateUrl: './practise.page.html',
  styleUrls: ['./practise.page.scss', '../../../app.component.scss'],
})
export class PractisePage {
  numberQuestion: number;
  options: Options;
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
  userStats: any;
  record: number;

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
              private alertController: AlertController,
              private serverService: ServerService,
              private http: HttpClient) {
    this.user = this.userService.getCurrentUser();
    this.userStats = this.userService.getCurrentUserStats();
    this.options = new Options(this.route.snapshot.paramMap.get('type'), this.route.snapshot.paramMap.get('level'));
    this.getRecord();
    this.numberQuestion = 0;
    this.initData();
  }

  initData() {
    this.spinnerLoading.show();
    this.wordsButtonOK = [];
    this.wordsButtonFail = [];
    this.initializeWords(this.options.level);
    this.answerDone = false;
    this.displayAnswer = false;
    this.counter = Constants.TIME_QUESTION;
    this.numberQuestion ++;
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.counter--;
      if (this.counter === 5) {
        this.less5seconds = true;
      }
      if (this.counter === 0) this.checkAnswer();
    }, 1000);
  }

  async startCountdown() {
    this.spinnerLoading.hide();

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

  getRecord() {
    if (this.options.level === Constants.LEVEL_C2)
      this.record = this.userStats.practise.c2;
    else if (this.options.level === Constants.LEVEL_C1)
      this.record = this.userStats.practise.c1;
    else if (this.options.level === Constants.LEVEL_B2)
      this.record = this.userStats.practise.b2;
    else if (this.options.level === Constants.LEVEL_B1)
      this.record = this.userStats.practise.b1;
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
    this.serverService.getServer().then(
        s => {
          if (!s.empty) {
            const server = s.docs.pop();
            if (server.data().wordsApiCallsDaily < 2500) {
              this.serverService.updateApiCalls(server.data(), server.id).then();
              this.doWordsApiCall();
            } else {
              this.toast.create('Ups! Quizzu used has been surpassed. You have to wait until tomorrow to play.');
              this.spinnerLoading.hide();
              this.router.navigate(['home/game']).then();
            }
          }
        }
    );
  }

  doWordsApiCall() {
    if (this.options.type === Constants.GAME_ANTONYMS)
      this.matchWordsApiService.getAntonym(this.correctWord)
          .subscribe((data: Antonyms) => {
            if (data.antonyms.length === 0)
              this.initializeWords(this.options.level);
            else {
              this.startCountdown().then();
              this.question = this.storeAllAntonyms(data);
            }
          }, error => {
            this.initializeWords(this.options.level);
          });
    else if (this.options.type === Constants.GAME_SYNONYMS)
      this.matchWordsApiService.getSynonym(this.correctWord)
          .subscribe((data: Synonyms) => {
            if (data.synonyms.length === 0)
              this.initializeWords(this.options.level);
            else {
              this.startCountdown().then();
              this.question = this.storeAllSynonyms(data);
            }
          }, error => {
            this.initializeWords(this.options.level);
          });
    else {
      this.matchWordsApiService.getDefinition(this.correctWord)
          .subscribe((data: Word) => {
            this.question = data.definitions[0].definition;
            this.startCountdown().then();
          }, error => {
            this.initializeWords(this.options.level);
          });
    }
  }

  storeAllSynonyms(data) {
    let allSynonyms = '';
    for (const synonym of data.synonyms) {
      allSynonyms = allSynonyms.concat(synonym , ', ');
    }
    allSynonyms = allSynonyms.slice(0 , allSynonyms.length - 2);
    return allSynonyms;
  }

  storeAllAntonyms(data) {
    let allAntonyms = '';
    for (const antonym of data.antonyms)
      allAntonyms = allAntonyms.concat(antonym, ', ');
    allAntonyms = allAntonyms.slice(0 , allAntonyms.length - 2);
    return allAntonyms;
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

    this.delay(500).then(
        p => {this.displayAnswer = true}
    );
  }

  closeQuestion() {
    if (this.isCorrectAnswer()) {
      this.initData();
    } else {
      if (this.record < this.numberQuestion) {
        this.updateRecord();
        this.showNewRecord().then();
      } else {
        this.router.navigate(['home/game']);
      }
    }
  }

  updateRecord() {
    this.toast.create(Messages.RECORD_PRACTISE + this.numberQuestion);
    this.userService.updatePractiseStats(this.options.level, this.numberQuestion).then(
        r => {
          this.record = this.numberQuestion;
        });
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then();
  }

  randomWord(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  isCorrectAnswer() {
    return this.correctWordPosition === this.answer;
  }

  async goToHome() {
    const alert = await this.alertController.create({
      header: Messages.PRACTISE_CLOSED_TITLE,
      message: Messages.PRACTISE_CLOSED,
      cssClass: 'alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Yes',
          handler: () => {
            this.router.navigate(['home/game']).then();
          }
        }
      ]
    });

    await alert.present();
  }

  async showNewRecord() {
    const modal = await this.modalController.create({
      component: FinishPractisePage,
      componentProps: {
        level: this.options.level,
        record: this.numberQuestion
      }
    });

    modal.onDidDismiss().then(() => {});

    return await modal.present();
  }
}
