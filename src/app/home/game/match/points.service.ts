import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../../shared/user-service';
import {ToastService} from '../../../shared/toast-service';
import {Constants} from '../../../shared/constants';

@Injectable({
    providedIn: 'root'
})

export class PointsService {
    user: any;

    constructor(
        public router: Router,
        private userService: UserService,
        private toast: ToastService,
    ) {
        this.user = this.userService.getCurrentUser();
    }

    increaseUserPointsByTurn(match) {
        const userInitPoints = this.user.points;
        if (match.gameLevel === 'c2')
            this.user.points = this.user.points + Constants.POINTS_QUESTION_CORRECT_C2;
        else if (match.gameLevel === 'c1')
            this.user.points = this.user.points + Constants.POINTS_QUESTION_CORRECT_C1;
        else if (match.gameLevel === 'b2')
            this.user.points = this.user.points + Constants.POINTS_QUESTION_CORRECT_B2;
        else if (match.gameLevel === 'b1')
            this.user.points = this.user.points + Constants.POINTS_QUESTION_CORRECT_B1;
        this.toast.create('+ ' + (this.user.points - userInitPoints) + ' points. Congratulations!');
        return this.userService.setCurrentUser(this.user);
    }

    increaseUserPointsByFinishMatch(match, state) {
        const userInitPoints = this.user.points;
        if (match.gameLevel === 'c2') {
            if (state === Constants.RESULT_GAME_VICTORY)
                this.user.points = this.user.points + Constants.POINTS_MATCH_VICTORY_C2;
            else if (state === Constants.RESULT_GAME_DRAW)
                this.user.points = this.user.points + Constants.POINTS_MATCH_DRAW_C2;
        }
        else if (match.gameLevel === 'c1') {
            if (state === Constants.RESULT_GAME_VICTORY)
                this.user.points = this.user.points + Constants.POINTS_MATCH_VICTORY_C1;
            else if (state === Constants.RESULT_GAME_DRAW)
                this.user.points = this.user.points + Constants.POINTS_MATCH_DRAW_C1;
        }
        else if (match.gameLevel === 'b2') {
            if (state === Constants.RESULT_GAME_VICTORY)
                this.user.points = this.user.points + Constants.POINTS_MATCH_VICTORY_B2;
            else if (state === Constants.RESULT_GAME_DRAW)
                this.user.points = this.user.points + Constants.POINTS_MATCH_DRAW_B2;
        }
        else if (match.gameLevel === 'b1') {
            if (state === Constants.RESULT_GAME_VICTORY)
                this.user.points = this.user.points + Constants.POINTS_MATCH_VICTORY_B1;
            else if (state === Constants.RESULT_GAME_DRAW)
                this.user.points = this.user.points + Constants.POINTS_MATCH_DRAW_B1;
        }
        this.toast.create('+ ' + (this.user.points - userInitPoints) + ' points. Congratulations!');
        return this.userService.setCurrentUser(this.user);
    }

}
