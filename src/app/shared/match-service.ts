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

@Injectable({
    providedIn: 'root'
})

export class MatchService {

    matchesActive: MatchShow[];
    matchesFinished: MatchShow[];
    matchesPendings: MatchShow[];
    currentMatch: any;
    user: any;

    constructor(
        public afStore: AngularFirestore,
        public router: Router,
        private spinnerLoading: SpinnerLoadingService,
        private toast: ToastService,
        private modalController: ModalController,
        private userService: UserService,
        private alertController: AlertController
    ) {
        this.matchesActive = [];
        this.matchesFinished = [];
        this.matchesPendings = [];
        this.user = this.userService.currentUser;
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
                if ((match.data().leaveId === '') && (match.data().winnerId === '')) {
                    this.createMatchDataShow(match.data(), match.id, userId, true);
                } else {
                    this.createMatchDataShow(match.data(), match.id, userId, false);
                }
            }
        });
    }

    createMatchDataShow(data, matchId, userId, active) {
        const isFinish = (data.leaveId === '' || data.winnerId === '');
        let match;
        if (data.player1.id === userId) {
            match = new MatchShow(matchId, isFinish, (data.winnerId === userId), data.player1.username,
                data.player2.username, data.player1Points, data.player2Points, data.gameLevel, data.player1Turn, data.matchAccepted);
        } else {
            match = new MatchShow(matchId, isFinish, (data.winnerId === userId), data.player2.username,
                data.player1.username, data.player2Points, data.player1Points, data.gameLevel, !data.player1Turn, data.matchAccepted);
        }
        this.saveMatchShowInArray(match, data, active);
    }

    saveMatchShowInArray(match, data, active) {
        if (!match.matchAccepted && data.player2.username.toLowerCase() === this.user.username) {
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

    createNewMatch(level, player2) {
        const match = new Match(level,
            new UserMin(this.user.id, this.user.username),
            player2);

        return this.afStore.collection('match').add(JSON.parse(JSON.stringify(match))).then(
            res => {
                res.get().then(
                    r => {
                        this.currentMatch = r.data();
                        if (player2.id === '') {
                            this.waitingAnotherPlayer(r.id);
                        } else {
                            this.createMatchDataShow(r.data(), r.id, this.user.id, true);
                        }
                    }
                );
            }
        );
    }

    leaveGameStarted(match) {
        return this.afStore.doc(`match/${match.id}`).ref.get().then(doc => {
            if (doc.exists) {
                const matchLeft = doc.data();
                matchLeft.leaveId = this.user.id;
                this.saveMatch(matchLeft, doc.id).then(
                    () => {
                        this.toast.create('Yo have left this game');
                    }
                );
            } else {
                this.toast.create('We can not find the game. Try again later');
                return false;
            }
        }).catch(() => {
            this.toast.create('We can not find the game. Try again later');
            return false;
        });
    }

    acceptMatchPending(match) {
        this.afStore.doc(`match/${match.id}`).ref.get().then(doc => {
            if (doc.exists) {
                const matchAccepted = doc.data();
                matchAccepted.matchAccepted = true;
                this.saveMatch(matchAccepted, doc.id).then(
                    () => {
                        this.toast.create('Game accepted');
                        this.createMatchDataShow(matchAccepted, match.id, this.user.id, true);
                    }
                );
            } else {
                this.toast.create('We can not find the game. Try again later');
                return false;
            }
        }).catch(() => {
            this.toast.create('We can not find the game. Try again later');
            return false;
        });
    }

    deleteMatchPending(match) {
        this.afStore.collection('match')
            .doc(match.id)
            .delete().then(
            () => {
                this.toast.create('Game removed successfully');
            }
        );
    }

    saveMatch(match, id) {
        return this.afStore.collection('match')
            .doc(id)
            .set(JSON.parse(JSON.stringify(match)), {
                merge: true
            });
    }

    findFreeMatch(level) {
        return this.afStore.collection('match')
            .ref
            .where('player2.username', '==', '')
            .where('gameLevel', '==', level)
            .get();
    }

    waitingAnotherPlayer(matchId) {
        return this.afStore.collection('match')
            .doc(matchId)
            .valueChanges()
            .subscribe( match => {
                this.currentMatch = match;
                if (this.currentMatch.player2.id !== '' ) {
                    this.alertOpenMatch(matchId).then();
                }
            });
    }

    async alertOpenMatch(matchId) {
        const alert = await this.alertController.create({
            header: 'New game is ready',
            message: 'Opponent found! Do you want to start now?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        this.createMatchDataShow(this.currentMatch, matchId, this.user.id, true);
                        this.router.navigate(['home/game']).then();
                        this.closeModal();
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        const url = 'home/game/match/' + matchId;
                        this.createMatchDataShow(this.currentMatch, matchId, this.user.id, true);
                        this.closeModal();
                        this.router.navigate([url]).then();
                    }
                }
            ]
        });

        await alert.present();
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
}
