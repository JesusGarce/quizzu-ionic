export abstract class Messages {
    static readonly IS_NOT_YOUR_TURN: string = 'Is not your turn yet, you have to wait until your opponent plays';
    static readonly NOT_REMAIN_QUESTIONS: string = 'You have done all your questions, now you should wait until your opponent finish.';
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
    static readonly VERIFY_EMAIL: string = 'You should verify your e-mail';
    static readonly RECORD_PRACTISE: string = 'Congratulations! Your new record is ';
    static readonly PRACTISE_CLOSED: string = 'Do you want to <strong>close</strong> this question? You will lose all your progression';
    static readonly PRACTISE_CLOSED_TITLE: string = 'Finish practise mode';
    static readonly CHOOSE_LEVEL_AND_GAME: string = 'You should choose a level and game before start';

    static readonly ERROR_SAVE_QUESTION: string = 'We can not save the question. Try later';
    static readonly ERROR_FIND_GAME: string = 'We can not find the game. Try again later';
    static readonly ERROR: string = 'Ups! Something happened. Try later';

    static readonly NOTIFICATION_TURN_TITLE: string = 'Is your turn';
    static readonly NOTIFICATION_TURN_MESSAGE: string = 'Rival has already played, now is your turn';
    static readonly NOTIFICATION_NEW_GAME_TITLE: string = 'New game request';
    static readonly NOTIFICATION_NEW_GAME_MESSAGE: string = 'Someone has challenged you. Play now!';
    static readonly NOTIFICATION_FRIEND_REQUEST_TITLE: string = 'New friend request';
    static readonly NOTIFICATION_FRIEND_REQUEST_MESSAGE: string = 'Someone wants to be your friend. Accept it!';
    static readonly NOTIFICATION_GAME_OVER_TITLE: string = 'The game is over';
    static readonly NOTIFICATION_GAME_OVER_MESSAGE: string = 'Go to your history to see the result';
    static readonly NOTIFICATION_LEVEL_TITLE: string = 'New level up!';
    static readonly NOTIFICATION_LEVEL_MESSAGE: string = 'Congratulations! You have increased your level to ';

}
