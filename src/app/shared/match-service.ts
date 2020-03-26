import {Injectable} from '@angular/core';
import {Match} from './match.model';
import {Router} from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {SpinnerLoadingService} from './spinner-loading/spinner-loading.service';
import {ToastService} from './toast-service';
import {UserService} from './user-service';
import {MatchShow} from './match-show.model';

@Injectable({
    providedIn: 'root'
})

export class MatchService {

    matchesActive: object[];
    matchesFinished: object[];

    constructor(
        public afStore: AngularFirestore,
        public router: Router,
        private spinnerLoading: SpinnerLoadingService,
        private toast: ToastService,
        private userService: UserService,
    ) {
        this.matchesActive = [];
        this.matchesFinished = [];
    }

    initMatches(userId) {
        this.afStore.collection('match').get().subscribe(
            matches => {
                if (matches.empty)
                    return false;
                matches.forEach( match => {
                    if ((match.data().player1Id === userId) || (match.data().player2Id === userId)) {
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

    createMatchDataShow(data, matchId, userId, active) {
        const isFinish = (data.leaveId === '');
        let match;
        // Player 1 is local
        if (data.player1Id === userId) {
            match = new MatchShow(matchId, isFinish, (data.winnerId === userId), data.player1Name,
                data.player2Name, data.player1Points, data.player2Points, data.level, data.turnPlayer1);
        } else {
            match = new MatchShow(matchId, isFinish, (data.winnerId === userId), data.player2Name,
                data.player1Name, data.player2Points, data.player1Points, data.level, !data.turnPlayer1);
        }
        if (active) {
            console.log('Active match');
            this.matchesActive.push(match);
        } else {
            this.matchesFinished.push(match);
        }
    }

    removeMatches() {
        this.matchesFinished = [];
        this.matchesActive = [];
    }
}
