import {UserMin} from './user-min.model';

export class User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    profile: string;
    points: number;
    level: number;
    friends: UserMin[];
    friendRequests: UserMin[];

    constructor(id, email, username, profile) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.profile = profile;
        this.firstName = '';
        this.lastName = '';
        this.birthDate = new Date();
        this.points = 0;
        this.level = 1;
        this.friends = [];
        this.friendRequests = [];
    }
}


