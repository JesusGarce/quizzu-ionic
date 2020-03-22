import construct = Reflect.construct;

export class UserStats {
    id: string;
    user: string;
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
}
