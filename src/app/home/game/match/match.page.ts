import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../shared/authentication-service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../shared/user-service';
import {SpinnerLoadingService} from '../../../shared/spinner-loading/spinner-loading.service';
import {MatchService} from '../../../shared/match-service';
import {CountdownStartPage} from './countdown-start/countdown-start.page';
import {ModalController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import {MatchWordsApiService} from '../../../shared/wordsapi-service/match-wordsapi-service';
import {ToastService} from '../../../shared/toast-service';
import {Word} from '../../../shared/wordsapi-service/word.model';
import {FinishMatchPage} from './finish-match/finish-match.page';
import {Constants} from '../../../shared/constants';
import {Messages} from '../../../shared/messages';
import {PointsService} from './points.service';
import {NotificationService} from '../../../shared/notification-service';
import {Synonyms} from '../../../shared/wordsapi-service/synonym.model';
import {Antonyms} from '../../../shared/wordsapi-service/antonym.model';

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
  displayAnswer = false;
  answer: number;
  consecutives: number;

  constructor( private authService: AuthenticationService,
               private router: Router,
               private userService: UserService,
               private matchService: MatchService,
               private pointsService: PointsService,
               private matchWordsApiService: MatchWordsApiService,
               private route: ActivatedRoute,
               private modalController: ModalController,
               private spinnerLoading: SpinnerLoadingService,
               private toast: ToastService,
               private http: HttpClient,
               private notificationService: NotificationService) {
    this.user = this.userService.getCurrentUser();
    this.matchService.getMatch(this.route.snapshot.paramMap.get('id')).then(doc => {
      if (doc.exists) {
        this.spinnerLoading.hide();
        this.match = doc.data();
        this.consecutives = 0;
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

  checkIfIsPlayerTurn() {
    if (!(this.match.player1Turn && (this.match.player1.id === this.user.id)) &&
        !(!this.match.player1Turn && (this.match.player2.id === this.user.id))) {
      this.toast.create(Messages.IS_NOT_YOUR_TURN);
      this.modalController.dismiss().then();
      this.router.navigate(['home/game']).then();
    }
  }

  checkIfRemainsQuestions() {
    if ((this.match.player1Turn && (this.match.player1RemainsQuestions < 1)) ||
        (!this.match.player1Turn && (this.match.player2RemainsQuestions < 1))) {
      this.toast.create(Messages.NOT_REMAIN_QUESTIONS);
      this.modalController.dismiss().then();
      this.router.navigate(['home/game']).then();
    }
  }

  ngOnInit() {
    this.startCountdown().then();
  }

  initData() {
    this.checkIfIsPlayerTurn();
    this.checkIfRemainsQuestions();
    this.wordsButtonOK = [];
    this.wordsButtonFail = [];
    this.initializeWords(this.match.gameLevel);
    this.loaded = true;
    this.answerDone = false;
    this.displayAnswer = false;
    this.counter = Constants.TIME_QUESTION;
    if (this.match.player1.id === this.user.id) {
      this.numberQuestion = 16 - this.match.player1RemainsQuestions;
    } else {
      this.numberQuestion = 16 - this.match.player2RemainsQuestions;
    }
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.counter --;
      if (this.counter === 5) {
        this.less5seconds = true;
      }
      if (this.counter === 0) this.doingAnswer(null);
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
    if (this.match.type === Constants.GAME_ANTONYMS)
      this.matchWordsApiService.getAntonym(this.correctWord)
          .subscribe((data: Antonyms) => {
            if (data.antonyms.length === 0)
              this.initializeWords(this.match.gameLevel);
            this.question = this.storeAllAntonyms(data);
          }, error => {
            this.initializeWords(this.match.gameLevel);
          });
    else if (this.match.type === Constants.GAME_SYNONYMS)
      this.matchWordsApiService.getSynonym(this.correctWord)
          .subscribe((data: Synonyms) => {
            if (data.synonyms.length === 0)
              this.initializeWords(this.match.gameLevel);
            this.question = this.storeAllSynonyms(data);
          }, error => {
            this.initializeWords(this.match.gameLevel);
          });
    else {
      this.matchWordsApiService.getDefinition(this.correctWord)
          .subscribe((data: Word) => {
            this.question = data.definitions[0].definition;
          }, error => {
            this.initializeWords(this.match.gameLevel);
          });
    }
  }

  storeAllSynonyms(data) {
    let allSynonyms = '';
    for (const synonym of data.synonyms)
      allSynonyms = allSynonyms.concat(synonym , ', ');
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

  closeQuestion() {
    if (this.matchService.checkIfMatchIsFinished(this.match))
      this.finishGame().then();
    else if (this.isCorrectAnswer()) {
      this.ngOnInit();
      this.initData();
    } else {
      this.router.navigate(['home/game']).then();
    }
  }

  checkAnswer() {
    if (!this.isCorrectAnswer())
      this.wordsButtonFail[this.answer] = true;
    else
      this.consecutives ++;
    this.matchService.saveResultsTurn(this.match, this.route.snapshot.paramMap.get('id'),
        this.counter, this.isCorrectAnswer(), this.consecutives).then(
            () => {
              this.displayAnswer = true;
              if (this.isCorrectAnswer()) {
                this.pointsService.increaseUserPointsByTurn(this.match).then();
              }
            }).catch(() => {
                this.toast.create(Messages.ERROR_SAVE_QUESTION);
            });
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

  getStateFinishMatch() {
    if (this.match.winnerId === this.user.id)
      return Constants.RESULT_GAME_VICTORY;
    else if (this.match.winnerId !== '')
      return Constants.RESULT_GAME_DEFEAT;
    else
      return Constants.RESULT_GAME_DRAW;
  }

  async finishGame() {
    this.match = this.matchService.getCurrentMatch();
    this.createNotificationFinishMatch(this.match);
    if (this.getStateFinishMatch() !== Constants.RESULT_GAME_DEFEAT)
      this.pointsService.increaseUserPointsByFinishMatch(this.match, this.getStateFinishMatch()).then();
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

  createNotificationFinishMatch(match) {
    if (this.user.id === match.player1.id)
      return this.notificationService.createNotification(Messages.NOTIFICATION_GAME_OVER_TITLE,
          Messages.NOTIFICATION_GAME_OVER_MESSAGE, this.match.player2.id);
    else
      return this.notificationService.createNotification(Messages.NOTIFICATION_GAME_OVER_TITLE,
          Messages.NOTIFICATION_GAME_OVER_MESSAGE, this.match.player1.id);
  }
}
