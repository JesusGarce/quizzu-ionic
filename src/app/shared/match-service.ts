import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {SpinnerLoadingService} from './spinner-loading/spinner-loading.service';
import {ToastService} from './toast-service';
import {UserService} from './user-service';
import {MatchShow} from './match-show.model';
import {UserMin} from './user-min.model';
import {Match} from './match.model';
import {AlertController, ModalController} from '@ionic/angular';
import {Messages} from './messages';
import {NotificationService} from './notification-service';

@Injectable({
    providedIn: 'root'
})

export class MatchService {

    matchesActive: MatchShow[];
    matchesFinished: MatchShow[];
    matchesPendings: MatchShow[];
    currentMatch: any;

    constructor(
        public afStore: AngularFirestore,
        public router: Router,
        private spinnerLoading: SpinnerLoadingService,
        private toast: ToastService,
        private modalController: ModalController,
        private userService: UserService,
        private alertController: AlertController,
        private notificationService: NotificationService,
    ) {
        this.matchesActive = [];
        this.matchesFinished = [];
        this.matchesPendings = [];
    }

    initMatches(userId) {
        this.afStore.collection('match').ref
            .where('player1.id', '==', userId)
            .get()
            .then(m => {
                if (m.empty) {
                    return false;
                }
                this.initMatchesDataShow(m, userId);
            });

        this.afStore.collection('match').ref
            .where('player2.id', '==', userId)
            .get()
            .then(m => {
                if (m.empty) {
                    return false;
                }
                this.initMatchesDataShow(m, userId);
            });
    }

    private initMatchesDataShow(matches, userId) {
        matches.forEach( match => {
            if ((match.data().player1.id === userId) || (match.data().player2.id === userId)) {
                if (!this.checkIfMatchIsFinished(match.data())) {
                    this.createMatchDataShow(match.data(), match.id, userId, true);
                } else {
                    this.createMatchDataShow(match.data(), match.id, userId, false);
                }
            }
        });
    }

    createMatchDataShow(data, matchId, userId, active) {
        const isFinish = this.checkIfMatchIsFinished(data);
        let match;
        if (data.player1.id === userId) {
            match = new MatchShow(matchId, isFinish, (data.winnerId === userId), data.player1.username,
                data.player2.username, data.player1Points, data.player2Points, data.gameLevel, data.player1Turn, data.matchAccepted,
                data.player1RemainsQuestions, data.player2RemainsQuestions);
        } else {
            match = new MatchShow(matchId, isFinish, (data.winnerId === userId), data.player2.username,
                data.player1.username, data.player2Points, data.player1Points, data.gameLevel, !data.player1Turn, data.matchAccepted,
                data.player1RemainsQuestions, data.player2RemainsQuestions);
        }
        this.saveMatchShowInArray(match, data, active);
    }

    saveMatchShowInArray(match, data, active) {
        if (!match.matchAccepted && data.player2.username.toLowerCase() === this.userService.getCurrentUser().username) {
            this.matchesPendings.push(match);
        } else {
            if (active) {
                if (match.awayPlayerName === '') {
                    match.awayPlayerName = 'Searching opponent...';
                    match.turnLocalPlayer = false;
                }
                this.matchesActive.push(match);
            } else {
                this.matchesFinished.push(match);
            }
        }
    }

    getMatch(id) {
        return this.afStore.doc(`match/${id}`).ref.get();
    }

    createNewMatch(options, player2) {
        const match = new Match(options,
            new UserMin(this.userService.getCurrentUser().id, this.userService.getCurrentUser().username,
                this.userService.getCurrentUser().profile), player2);

        return this.afStore.collection('match').add(JSON.parse(JSON.stringify(match))).then(
            res => {
                res.get().then(
                    r => {
                        this.currentMatch = r.data();
                        if (player2.id === '') {
                            this.waitingAnotherPlayer(r.id);
                        } else {
                            this.notificationService.createNotification(Messages.NOTIFICATION_NEW_GAME_TITLE,
                                Messages.NOTIFICATION_NEW_GAME_MESSAGE, player2.id).then();
                            this.createMatchDataShow(r.data(), r.id, this.userService.getCurrentUser().id, true);
                        }
                    }
                );
            }
        );
    }

    leaveGameStarted(match) {
        if (match.matchAccepted) {
            return this.afStore.doc(`match/${match.id}`).ref.get().then(doc => {
                if (doc.exists) {
                    const matchLeft = doc.data();
                    matchLeft.leaveId = this.userService.getCurrentUser().id;
                    this.saveMatch(matchLeft, doc.id).then(
                        () => {
                            this.toast.create(Messages.LEFT_GAME);
                        }
                    );
                } else {
                    this.toast.create(Messages.ERROR_FIND_GAME);
                    return false;
                }
            }).catch(() => {
                this.toast.create(Messages.ERROR_FIND_GAME);
                return false;
            });
        } else {
            return this.deleteMatchPending(match).then(
                () => {
                    return true;
                }
            );
        }
    }

    acceptMatchPending(match) {
        this.afStore.doc(`match/${match.id}`).ref.get().then(doc => {
            if (doc.exists) {
                const matchAccepted = doc.data();
                matchAccepted.matchAccepted = true;
                this.saveMatch(matchAccepted, doc.id).then(
                    () => {
                        this.toast.create(Messages.ACCEPTED_GAME);
                        this.createMatchDataShow(matchAccepted, match.id, this.userService.getCurrentUser().id, true);
                    }
                );
            } else {
                this.toast.create(Messages.ERROR_FIND_GAME);
                return false;
            }
        }).catch(() => {
            this.toast.create(Messages.ERROR_FIND_GAME);
            return false;
        });
    }

    deleteMatchPending(match) {
        return this.afStore.collection('match')
            .doc(match.id)
            .delete()
            .then( resp => {});
    }

    saveMatch(match, id) {
        this.currentMatch = match;
        return this.afStore.collection('match')
            .doc(id)
            .set(JSON.parse(JSON.stringify(match)), {
                merge: true
            });
    }

    checkIfMatchIsFinished(match) {
        return ((match.player1RemainsQuestions < 1) && (match.player2RemainsQuestions < 1));
    }

    finishMatch(match) {
        if (match.player1Points > match.player2Points)
            match.winnerId = match.player1.id;
        else if (match.player1Points < match.player2Points)
            match.winnerId = match.player2.id;
        return match;
    }

    saveResultsTurn(match, matchId, counter, correct, consecutives) {
        if (match.player1Turn) {
            match.player1RemainsQuestions --;
            match.player1Points = match.player1Points + this.getTurnPoints(counter, correct, consecutives);
        } else {
            match.player2RemainsQuestions --;
            match.player2Points = match.player2Points + this.getTurnPoints(counter, correct, consecutives);
        }
        if (!correct && !this.oppositePlayerFinish(match) || (this.playerFinish(match))) {
            match.player1Turn = !match.player1Turn;
            if (!this.checkIfMatchIsFinished(match))
                this.sendNotificationTurn(match);
        }
        if (this.checkIfMatchIsFinished(match)) {
            match = this.finishMatch(match);
            this.userService.updateUserStats(match, match.player1.id);
            this.userService.updateUserStats(match, match.player2.id);
        }
        this.updateMatchInList(match, matchId);
        return this.saveMatch(match, matchId);
    }

    sendNotificationTurn(match) {
        if (match.player1Turn)
            this.notificationService.createNotification(Messages.NOTIFICATION_TURN_TITLE,
                Messages.NOTIFICATION_TURN_MESSAGE, match.player1.id).then();
        else
            this.notificationService.createNotification(Messages.NOTIFICATION_TURN_TITLE,
                Messages.NOTIFICATION_TURN_MESSAGE, match.player2.id).then();
    }

    playerFinish(match) {
        if (match.player1Turn)
            return (match.player1RemainsQuestions < 1);
        else
            return (match.player2RemainsQuestions < 1);
    }

    oppositePlayerFinish(match) {
        if (match.player1Turn)
            return (match.player2RemainsQuestions < 1);
        else
            return (match.player1RemainsQuestions < 1);
    }

    getTurnPoints(counter, correct, consecutives) {
        if (!correct)
            return 0;
        return Math.round(50 * ((100 + (counter * 1)) / 100) * ((100 + (consecutives * 25)) / 100));
    }

    findFreeMatch(options) {
        return this.afStore.collection('match')
            .ref
            .where('player2.username', '==', '')
            .where('gameLevel', '==', options.level)
            .where('type', '==', options.type)
            .get();
    }

    waitingAnotherPlayer(matchId) {
        return this.afStore.collection('match')
            .doc(matchId)
            .valueChanges()
            .subscribe( match => {
                this.currentMatch = match;
                if (this.currentMatch.player2.id !== '' &&
                    this.currentMatch.player1RemainsQuestions === 15 &&
                    this.currentMatch.player2RemainsQuestions === 15) {
                    this.alertOpenMatch(matchId).then();
                }
            });
    }

    async alertOpenMatch(matchId) {
        const alert = await this.alertController.create({
            header: Messages.NEW_GAME_TITLE,
            message: Messages.NEW_GAME,
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        this.createMatchDataShow(this.currentMatch, matchId, this.userService.getCurrentUser().id, true);
                        this.router.navigate(['home/game']).then();
                        this.closeModal();
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        const url = 'home/game/match/' + matchId;
                        this.createMatchDataShow(this.currentMatch, matchId, this.userService.getCurrentUser().id, true);
                        this.closeModal();
                        this.router.navigate([url]).then();
                    }
                }
            ]
        });
        await alert.present();
    }

    deleteMatchesFinished() {
        for (const match of this.matchesFinished) {
            this.afStore.collection('match')
                .doc(match.id)
                .delete()
                .then();
        }
        this.matchesFinished = [];
    }

    getCurrentMatch() {
        return this.currentMatch;
    }

    removeMatches() {
        this.matchesFinished = [];
        this.matchesActive = [];
        this.matchesPendings = [];
    }

    async closeModal() {
        if (await this.modalController.getTop() !== undefined)
            await this.modalController.dismiss();
    }

    updateMatchInList(match, matchId) {
        this.matchesActive = this.matchesActive.filter(p => p.id !== matchId);
        this.createMatchDataShow(match, matchId, this.userService.getCurrentUser().id, true);
    }
}
