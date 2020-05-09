
export class UserStats {
    user: string;
    practise: {
        c2: number,
        c1: number,
        b2: number,
        b1: number
    };
    c2level: {
        c2played: number
        c2won: number,
        c2draw: number,
        c2lost: number,
    };
    c1level: {
        c1played: number
        c1won: number,
        c1draw: number,
        c1lost: number,
    };
    b2level: {
        b2played: number
        b2won: number,
        b2draw: number,
        b2lost: number,
    };
    b1level: {
        b1played: number
        b1won: number,
        b1draw: number,
        b1lost: number,
    };

    constructor(user) {
        this.user = user;

        this.practise.c2 = 0;
        this.practise.c1 = 0;
        this.practise.b2 = 0;
        this.practise.b1 = 0;

        this.c2level.c2played = 0;
        this.c2level.c2won = 0;
        this.c2level.c2draw = 0;
        this.c2level.c2lost = 0;

        this.c1level.c1played = 0;
        this.c1level.c1won = 0;
        this.c1level.c1draw = 0;
        this.c1level.c1lost = 0;

        this.b2level.b2played = 0;
        this.b2level.b2won = 0;
        this.b2level.b2draw = 0;
        this.b2level.b2lost = 0;

        this.b1level.b1played = 0;
        this.b1level.b1won = 0;
        this.b1level.b1draw = 0;
        this.b1level.b1lost = 0;
    }
}
