export class MatchShow {
    id: string;
    isFinish: boolean;
    localWin: boolean;
    localPlayerName: string;
    awayPlayerName: string;
    localPlayerPoints: number;
    awayPlayerPoints: number;
    level: string;
    turnLocalPlayer: boolean;
    matchAccepted: boolean;
    localPlayerRemainQuestions: number;
    awayPlayerRemainQuestions: number;
    
    constructor(id, isFinish, localWin, localPlayerName, awayPlayerName, localPlayerPoints, awayPlayerPoints, level,
                turnLocalPlayer, matchAccepted, localPlayerRemainQuestions, awayPlayerRemainQuestions) {
        this.id = id;
        this.isFinish = isFinish;
        this.localWin = localWin;
        this.localPlayerName = localPlayerName;
        this.awayPlayerName = awayPlayerName;
        this.localPlayerPoints = localPlayerPoints;
        this.awayPlayerPoints = awayPlayerPoints;
        this.level = level;
        this.turnLocalPlayer = turnLocalPlayer;
        this.matchAccepted = matchAccepted;
        this.localPlayerRemainQuestions = localPlayerRemainQuestions;
        this.awayPlayerRemainQuestions = awayPlayerRemainQuestions;
    }
}
