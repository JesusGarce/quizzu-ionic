import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../../../shared/services/user-service';
import {ToastService} from '../../../../shared/services/toast-service';
import {Constants} from '../../../../shared/constants';
import {NotificationService} from '../../../../shared/services/notification-service';
import {Messages} from '../../../../shared/messages';

@Injectable({
    providedIn: 'root'
})

export class PointsService {
    user: any;
    nextLevel: number;

    constructor(
        public router: Router,
        private userService: UserService,
        private toast: ToastService,
        private notificationService: NotificationService,
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
        this.checkIncreaseLevel(this.user);
        return this.userService.setCurrentUser(this.user);
    }

    getOpponentId(match) {
        if (this.userService.getCurrentUser().uid === match.player1.id)
            return match.player2.id;
        else
            return match.player1.id;
    }

    increaseUserPointsByFinishMatch(match, state) {
        console.log('increaseUserPointsByFinishMatch');
        console.log(match);
        if (state === Constants.RESULT_GAME_VICTORY)
            this.increaseUserPointsByFinishMatchUser(this.userService.getCurrentUser(), match, state).then();
        else if (state === Constants.RESULT_GAME_DRAW) {
            this.increaseUserPointsByFinishMatchUser(this.userService.getCurrentUser(), match, state).then();
            this.userService.getUser(this.getOpponentId(match)).then(
                user => {
                    this.increaseUserPointsByFinishMatchUser(user.data(), match, state).then();
                }
            );
        } else {
            this.userService.getUser(match.winnerId).then(
                user => {
                    this.increaseUserPointsByFinishMatchUser(user.data(), match, state).then();
                }
            );
        }
    }

    increaseUserPointsByFinishMatchUser(user, match, state) {
        const userInitPoints = user.points;
        if (match.gameLevel === 'c2') {
            if (state === Constants.RESULT_GAME_VICTORY)
                user.points = user.points + Constants.POINTS_MATCH_VICTORY_C2;
            else if (state === Constants.RESULT_GAME_DRAW)
                user.points = user.points + Constants.POINTS_MATCH_DRAW_C2;
        }
        else if (match.gameLevel === 'c1') {
            if (state === Constants.RESULT_GAME_VICTORY)
                user.points = user.points + Constants.POINTS_MATCH_VICTORY_C1;
            else if (state === Constants.RESULT_GAME_DRAW)
                user.points = user.points + Constants.POINTS_MATCH_DRAW_C1;
        }
        else if (match.gameLevel === 'b2') {
            if (state === Constants.RESULT_GAME_VICTORY) {
                user.points = user.points + Constants.POINTS_MATCH_VICTORY_B2;
            }
            else if (state === Constants.RESULT_GAME_DRAW) {
                user.points = user.points + Constants.POINTS_MATCH_DRAW_B2;
            }
        }
        else if (match.gameLevel === 'b1') {
            if (state === Constants.RESULT_GAME_VICTORY)
                user.points = user.points + Constants.POINTS_MATCH_VICTORY_B1;
            else if (state === Constants.RESULT_GAME_DRAW)
                user.points = user.points + Constants.POINTS_MATCH_DRAW_B1;
        }
        this.checkIncreaseLevel(user);
        this.toast.create('+ ' + (user.points - userInitPoints) + ' points. Congratulations!');
        return this.userService.setUser(user);
    }

    checkIncreaseLevel(user) {
        this.getNextLevel(Constants.LEVEL_BASE, 1, user);
        if (user.level !== this.nextLevel - 1) {
            this.notificationService.createNotification(Messages.NOTIFICATION_LEVEL_TITLE,
                Messages.NOTIFICATION_LEVEL_MESSAGE + (this.nextLevel - 1), user.id).then();
            user.level = this.nextLevel - 1;
        }
    }

    getNextLevel(points, level, user) {
        if (points < user.points)
            this.getNextLevel(points + ((100 * (level)) * Math.log(points) * (level)), level + 1, user);
        else
            this.nextLevel = level;
    }

}
