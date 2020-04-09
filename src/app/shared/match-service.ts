import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {SpinnerLoadingService} from './spinner-loading/spinner-loading.service';
import {ToastService} from './toast-service';
import {UserService} from './user-service';
import {MatchShow} from './match-show.model';
import {UserMin} from './user-min.model';
import {Match} from './match.model';

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
        private userService: UserService,
    ) {
        this.matchesActive = [];
        this.matchesFinished = [];
        this.matchesPendings = [];
    }

    initMatches(userId) {
        this.afStore.collection('match').get().subscribe(
            matches => {
                if (matches.empty) {
                    return false;
                }
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
        );
    }

    getMatch(id) {
        return this.afStore.doc(`match/${id}`).ref.get();
    }

    createNewMatch(level, player2) {
        const match = new Match(level,
            new UserMin(this.userService.currentUser.id, this.userService.currentUser.username),
            player2);

        return this.afStore.collection('match').add(JSON.parse(JSON.stringify(match))).then(
            res => {
                res.get().then(
                    r => {
                        this.createMatchDataShow(r.data(), r.id, this.userService.currentUser.id, true);
                        this.currentMatch = r.data();
                    }
                );
            }, error => {
                this.toast.create('ERROR: ' + error.toString());
            }
        );
    }

    leftGameStarted(match) {
        return this.afStore.doc(`match/${match.id}`).ref.get().then(doc => {
            if (doc.exists) {
                const matchLeft = doc.data();
                matchLeft.leaveId = this.userService.currentUser.id;
                this.saveMatch(matchLeft, doc.id).then(
                    mA => {
                        this.toast.create('Yo have left this game');
                    }
                );
            } else {
                this.toast.create('We can not find the game. Try again later');
                return false;
            }
        }).catch(err => {
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
                    mA => {
                        this.toast.create('Game accepted');
                        this.createMatchDataShow(matchAccepted, match.id, this.userService.currentUser.id, true);
                    }
                );
            } else {
                this.toast.create('We can not find the game. Try again later');
                return false;
            }
        }).catch(err => {
            this.toast.create('We can not find the game. Try again later');
            return false;
        });
    }

    deleteMatchPending(match) {
        this.afStore.collection('match')
            .doc(match.id)
            .delete().then(
                r => {
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

    createMatchDataShow(data, matchId, userId, active) {
        const isFinish = (data.leaveId === '' || data.winnerId === '');
        let match;
        // Player 1 is local
        if (data.player1.id === userId) {
            match = new MatchShow(matchId, isFinish, (data.winnerId === userId), data.player1.username,
                data.player2.username, data.player1Points, data.player2Points, data.gameLevel, data.turnPlayer1, data.matchAccepted);
        } else {
            match = new MatchShow(matchId, isFinish, (data.winnerId === userId), data.player2.username,
                data.player1.username, data.player2Points, data.player1Points, data.gameLevel, !data.turnPlayer1, data.matchAccepted);
        }
        if (!match.matchAccepted && data.player2.username.toLowerCase() === this.userService.getCurrentUsername()) {
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

    removeMatches() {
        this.matchesFinished = [];
        this.matchesActive = [];
        this.matchesPendings = [];
    }
}
