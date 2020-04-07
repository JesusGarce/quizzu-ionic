import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
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

    matchesActive: object[];
    matchesFinished: object[];
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
    }

    initMatches(userId) {
        this.afStore.collection('match').get().subscribe(
            matches => {
                if (matches.empty)
                    return false;
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

    createNewMatch(level, player2) {
        const match = new Match(level,
            new UserMin(this.userService.currentUser.id, this.userService.currentUser.username),
            player2);

        return this.afStore.collection('match').add(JSON.parse(JSON.stringify(match))).then(
            res => {
                res.get().then(
                    r => {
                        console.log(JSON.stringify(r.data()));
                        this.createMatchDataShow(r.data(), r.id, this.userService.currentUser.id, true);
                        this.currentMatch = r.data();
                    }
                );
            }, error => {
                console.log('ERROR: ' + error.toString());
            }
        );
    }

    createMatchDataShow(data, matchId, userId, active) {
        const isFinish = (data.leaveId === '');
        let match;
        // Player 1 is local
        if (data.player1.id === userId) {
            match = new MatchShow(matchId, isFinish, (data.winnerId === userId), data.player1.username,
                data.player2.username, data.player1Points, data.player2Points, data.gameLevel, data.turnPlayer1);
        } else {
            match = new MatchShow(matchId, isFinish, (data.winnerId === userId), data.player2.username,
                data.player1.username, data.player2Points, data.player1Points, data.gameLevel, !data.turnPlayer1);
        }
        if (active) {
            if (match.awayPlayerName === '')
                match.awayPlayerName = 'Without opponent';
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
