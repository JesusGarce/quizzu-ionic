export class Server {
    date: Date;
    day: number;
    wordsApiCallsDaily: number;

    constructor(date: Date, day: number, wordsApiCallsDaily: number) {
        this.date = date;
        this.day = day;
        this.wordsApiCallsDaily = wordsApiCallsDaily;
    }
}
