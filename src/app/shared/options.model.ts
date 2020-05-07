export class Options {
    type: string;
    level: string;

    constructor(type, level) {
        this.type = type;
        this.level = level;
    }

    setType(type) {
        this.type = type;
    }

    setLevel(level) {
        this.level = level;
    }
}
