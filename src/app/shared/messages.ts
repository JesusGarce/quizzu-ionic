export abstract class Messages {
    static readonly IS_NOT_YOUR_TURN: string = 'Is not your turn yet, you have to wait until your opponent plays';
    static readonly CLOSE_SEARCHING_TITLE: string = 'Close searching';
    static readonly CLOSE_SEARCHING: string = 'Do you want to <strong>close</strong> the search? ' +
        'We will notify you when we find a opponent';
    static readonly GIVE_UP_MATCH_TITLE: string = 'Do you want to give up?';
    static readonly GIVE_UP_MATCH: string = 'Do you want to <strong>leave</strong> this game?';
    static readonly HISTORY_DELETED: string = 'Match history deleted successfully';
    static readonly FRIEND_DELETED: string = 'Friend delete successfully';
    static readonly DELETE_FRIEND_TITLE: string = 'Delete friend';
    static readonly DELETE_FRIEND: string = 'Do you want to <strong>delete</strong> this friend?';
    static readonly PROFILE_CHANGED: string = 'Your profile has changed successfully';
    static readonly PROFILE_DIFFERENT_PASSWORDS: string = 'Your profile has changed successfully';
    static readonly PROFILE_PASSWORD_LENGTH_ERROR: string = 'Passwords are not the same';
    static readonly PROFILE_PASSWORD_CHANGED: string = 'Password has been changed successfully';
    static readonly PROFILE_PASSWORD_INCORRECT: string = 'Current password is incorrect. Try again';
    static readonly PROFILE_PASSWORD_TOO_MANY_REQUESTS: string = 'Too many requests. Wait a few minutes to try it again.';
    static readonly USER_NOT_FOUND: string = 'We can not find the user';
    static readonly FRIEND_REQUEST_SENT: string = 'Friend request sent';
    static readonly PASSWORD_CHANGE_REQUEST_SENT: string = 'Password reset email has been sent, please check your inbox';
    static readonly LEFT_GAME: string = 'You have left this game';
    static readonly ACCEPTED_GAME: string = 'Game accepted';
    static readonly NEW_GAME_TITLE: string = 'New game is ready';
    static readonly NEW_GAME: string = 'Opponent found! Do you want to start now?';

    static readonly ERROR_SAVE_QUESTION: string = 'We can not save the question. Try later';
    static readonly ERROR_FIND_GAME: string = 'We can not find the game. Try again later';
    static readonly ERROR: string = 'Ups! Something happened. Try later';
}
