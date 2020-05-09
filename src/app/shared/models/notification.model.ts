export class Notification {
    id: string;
    title: string;
    message: string;
    userId: string;

    constructor(id, title, message, userId) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.userId = userId;
    }

    setId(id) {
        this.id = id;
    }
}
