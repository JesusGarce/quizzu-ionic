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
}


