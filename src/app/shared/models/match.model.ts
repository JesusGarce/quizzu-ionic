import {UserMin} from './user-min.model';

export class Match {
    leaveId: string;
    player1Points: number;
    player2Points: number;
    created: Date;
    gameLevel: string;
    type: string;
    player1: UserMin;
    player2: UserMin;
    matchAccepted: boolean;
    player1Turn: boolean;
    player1RemainsQuestions: number;
    player2RemainsQuestions: number;
    winnerId: string;

    public constructor(options, player1, player2) {
        this.leaveId = '';
        this.player1Points = 0;
        this.player2Points = 0;
        this.created = new Date();
        this.gameLevel = options.level;
        this.type = options.type;
        this.player1 = player1;
        this.player2 = player2;
        this.matchAccepted = false;
        this.player1Turn = true;
        this.player1RemainsQuestions = 15;
        this.player2RemainsQuestions = 15;
        this.winnerId = '';
    }
}