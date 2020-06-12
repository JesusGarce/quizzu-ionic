import {Injectable} from '@angular/core';
import {User} from './models/user.model';
import {Router} from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {UserStats} from './models/user-stats.model';
import {SpinnerLoadingService} from './spinner-loading/spinner-loading.service';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {ToastService} from './toast-service';
import {UserMin} from './models/user-min.model';
import {Messages} from './messages';
import {NotificationService} from './notification-service';
import {Constants} from './constants';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    currentUser: any;
    profile: any;
    currentUserStats: any;
    downloadURL: Observable<string>;
    profileDefaultImage = 'https://firebasestorage.googleapis.com/v0/b/quizzu-1fd29.appspot.com/o/profile%2Fdefault.png?alt=media&token=8fc2e87d-cce5-4239-a169-89d610cf9694';

    constructor(
        public afStore: AngularFirestore,
        public router: Router,
        private storage: AngularFireStorage,
        private spinnerLoading: SpinnerLoadingService,
        private toast: ToastService,
        private notificationService: NotificationService,
    ) {
    }

    createUser(user, userId) {
        user.id = userId;
        user.username = user.username.toLowerCase();
        user.level = 1;
        user.points = 0;
        user.friends = [];
        user.friendRequests = [];
        user.profile = this.profileDefaultImage;
        user.notifEnabled = true;
        this.storeNewUser(user, userId);
    }

    storeNewUser(user, userId) {
        this.currentUser = user;
        this.profile = this.currentUser.profile;
        this.createUserStats(userId);
        const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.id}`);
        userRef.set(JSON.parse(JSON.stringify(user)), {
            merge: true
        });
        const userStatsRef: AngularFirestoreDocument<any> = this.afStore.doc(`user-stats/${user.id}`);
        userStatsRef.set(JSON.parse(JSON.stringify(this.currentUserStats)), {
            merge: true
        });
    }

    createUserStats(userId) {
        this.currentUserStats = new UserStats(userId);
    }

    addUser() {
        return this.afStore.collection('users').add(JSON.parse(JSON.stringify(this.currentUser)));
    }

    loginOrSignInFromOAuth(user) {
        this.getUser(user.uid).then(
            r => {
                if (r.exists) {
                    this.initCurrentUser(user.uid);
                    this.router.navigate(['home']);
                    this.spinnerLoading.hide();
                } else {
                    this.createUserFromDataOAuth(user);
                }
            }
        );
    }

    createUserFromDataOAuth(user) {
        const userData = new User(user.uid, user.email, user.displayName.toLowerCase(), user.photoURL);
        this.storeNewUser(userData, user.uid);
    }

    existUser(username) {
        return this.afStore.collection('users')
            .ref
            .where('username', '==', username)
            .get();
    }

    initCurrentUser(uid) {
        this.afStore.doc(`users/${uid}`).ref.get().then(doc => {
            if (doc.exists) {
                this.currentUser = doc.data();
                this.profile = this.currentUser.profile;
                if (this.isNotificationsEnabled()) {
                    this.initNotificationSystem();
                }
            } else {
                this.toast.create(Messages.USER_NOT_FOUND);
            }
        }).catch(err => {
            this.toast.create(Messages.ERROR);
        });
    }

    initNotificationSystem() {
        this.notificationService.getNotificationsByUserId(this.currentUser.id);
        this.notificationService.listeningNotification(this.currentUser.id);
    }

    initCurrentUserStats(uid) {
        this.afStore.doc(`user-stats/${uid}`).ref.get().then(doc => {
            if (doc.exists) {
                this.currentUserStats = doc.data();
            } else {
            }
        }).catch(err => {
            this.toast.create(Messages.ERROR + ':' + err);
        });
    }

    removeCurrentUser() {
        this.currentUser = '';
        this.profile = '';
    }

    setCurrentUser(editUser) {
        this.currentUser = editUser;
        return this.afStore.collection('users')
            .doc(this.currentUser.id)
            .set(JSON.parse(JSON.stringify(editUser)), {
                merge: true
            });
    }

    setUser(user) {
        if (user.id === this.currentUser.id)
            this.currentUser = user;
        return this.afStore.collection('users')
            .doc(user.id)
            .set(JSON.parse(JSON.stringify(user)), {
                merge: true
            });
    }

    setUserStats(userStats, userId) {
        return this.afStore.collection('user-stats')
            .doc(userId)
            .set(JSON.parse(JSON.stringify(userStats)), {
                merge: true
            });
    }

    updateUserStats(match, playerId) {
        this.getUserStats(playerId).then(
            doc => {
                let userStats = doc.data();
                userStats = this.updateUserStatsByLevel(match, userStats, playerId);
                this.setUserStats(userStats, playerId).then(
                    () => {}
                );
            }
        ).catch(
            (err) => {
                this.toast.create(Messages.ERROR);
            }
        );
    }

    updateUserStatsByLevel(match, userStats, userId) {
        switch (match.gameLevel) {
            case 'b1':
                userStats.b1level.b1played = userStats.b1level.b1played + 1;
                if (match.winnerId === userId)
                    userStats.b1level.b1won = userStats.b1level.b1won + 1;
                else if (match.winnerId !== '')
                    userStats.b1level.b1lost = userStats.b1level.b1lost + 1;
                else
                    userStats.b1level.b1draw = userStats.b1level.b1draw + 1;
                break;
            case 'b2':
                userStats.b2level.b2played = userStats.b2level.b2played + 1;
                if (match.winnerId === userId)
                    userStats.b2level.b2won = userStats.b2level.b2won + 1;
                else if (match.winnerId !== '')
                    userStats.b2level.b2lost = userStats.b2level.b2lost + 1;
                else
                    userStats.b2level.b2draw = userStats.b2level.b2draw + 1;
                break;
            case 'c1':
                userStats.c1level.c1played = userStats.c1level.c1played + 1;
                if (match.winnerId === userId)
                    userStats.c1level.c1won = userStats.c1level.c1won + 1;
                else if (match.winnerId !== '')
                    userStats.c1level.c1lost = userStats.c1level.c1lost + 1;
                else
                    userStats.c1level.c1draw = userStats.c1level.c1draw + 1;
                break;
            case 'c2':
                userStats.c2level.c2played = userStats.c2level.c2played + 1;
                if (match.winnerId === userId)
                    userStats.c2level.c2won = userStats.c2level.c2won + 1;
                else if (match.winnerId !== '')
                    userStats.c2level.c2lost = userStats.c2level.c2lost + 1;
                else
                    userStats.c2level.c2draw = userStats.c2level.c2draw + 1;
                break;
        }
        return userStats;
    }

    updatePractiseStats(level, consecutives) {
        if (level === Constants.LEVEL_C2)
            this.currentUserStats.practise.c2 = consecutives;
        else if (level === Constants.LEVEL_C1)
            this.currentUserStats.practise.c1 = consecutives;
        else if (level === Constants.LEVEL_B2)
            this.currentUserStats.practise.b2 = consecutives;
        else if (level === Constants.LEVEL_B1)
            this.currentUserStats.practise.b1 = consecutives;

        return this.setUserStats(this.currentUserStats, this.currentUser.id);
    }

    onProfileUpload(event) {
        this.spinnerLoading.show();
        const n = Date.now();
        const file = event.target.files[0];
        const filePath = `profile/${n}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(`profile/${n}`, file);
        return task
            .snapshotChanges()
            .pipe(
                finalize(() => {
                    this.downloadURL = fileRef.getDownloadURL();
                    this.downloadURL.subscribe(url => {
                        if (url) {
                            this.profile = url;
                            url = this.add200x200ToPath(url);
                            this.currentUser.profile = url;
                            this.spinnerLoading.hide();
                            this.setCurrentUser(this.currentUser).then();
                        }
                    });
                })
            )
            .subscribe(url => {
            });
    }

    add200x200ToPath(url) {
        const regexp = new RegExp('[?]');
        const exec = regexp.exec(url);
        return url.substr(0, exec.index) + '_200x200' + url.substr(exec.index);
    }

    acceptFriendRequest(friend) {
        this.filterFriendRequests(friend);
        this.currentUser.friends.push(friend);
        return this.afStore.collection('users')
            .doc(this.currentUser.id)
            .set(JSON.parse(JSON.stringify(this.currentUser)), {
                merge: true
            });
    }

    acceptFriendRequestOtherUser(friend) {
        this.afStore.doc(`users/${friend.id}`).ref.get().then(doc => {
            if (doc.exists) {
                const friendUser = doc.data();
                friendUser.friends.push(new UserMin(this.currentUser.id, this.currentUser.username, this.currentUser.profile));
                this.afStore.collection('users')
                    .doc(friendUser.id)
                    .set(JSON.parse(JSON.stringify(friendUser)), {
                        merge: true
                    });
            }
        }).catch(err => {
            this.toast.create(Messages.ERROR + ':' + err);
        });
    }

    sendFriendRequest(friend) {
        this.afStore.doc(`users/${friend.id}`).ref.get().then(doc => {
            if (doc.exists) {
                const friendUser = doc.data();
                friendUser.friendRequests.push(new UserMin(this.currentUser.id, this.currentUser.username, this.currentUser.profile));
                this.afStore.collection('users')
                    .doc(friendUser.id)
                    .set(JSON.parse(JSON.stringify(friendUser)), {
                        merge: true
                    });
                this.toast.create(Messages.FRIEND_REQUEST_SENT);
                this.notificationService.createNotification(Messages.NOTIFICATION_FRIEND_REQUEST_TITLE,
                    Messages.NOTIFICATION_FRIEND_REQUEST_MESSAGE, friendUser.id).then();
            } else {
                this.toast.create(Messages.USER_NOT_FOUND);
            }
        }).catch(err => {
            this.toast.create(Messages.ERROR + ':' + err);
        });
    }

    removeFriendRequest(friend) {
        this.filterFriendRequests(friend);
        return this.afStore.collection('users')
            .doc(this.currentUser.id)
            .set(JSON.parse(JSON.stringify(this.currentUser)), {
                merge: true
            });
    }

    removeFriend(friend) {
        this.currentUser.friends = this.currentUser.friends.filter( p => p.id !== friend.id);
        return this.afStore.collection('users')
            .doc(this.currentUser.id)
            .set(JSON.parse(JSON.stringify(this.currentUser)), {
                merge: true
            });
    }

    removeFriendOtherUser(friend) {
        this.afStore.doc(`users/${friend.id}`).ref.get().then(doc => {
            if (doc.exists) {
                const friendUser = doc.data();
                friendUser.friends = friendUser.friends.filter(p => p.id !== this.currentUser.id);
                this.afStore.collection('users')
                    .doc(friendUser.id)
                    .set(JSON.parse(JSON.stringify(friendUser)), {
                        merge: true
                    });
            }
        }).catch(err => {
            this.toast.create(Messages.ERROR + ':' + err);
        });
    }

    searchUser(query) {
        const queryLC = query.toLowerCase();
        return this.afStore.collection('users').ref
            .where('username', '>=', queryLC)
            .where('username', '<=', queryLC + 'zzz')
            .limit(10)
            .get();
    }

    getUser(id) {
        return this.afStore.doc(`users/${id}`).ref.get();
    }

    getUserStats(id) {
        return this.afStore.doc(`user-stats/${id}`).ref.get();
    }

    filterFriendRequests(friend) {
        this.currentUser.friendRequests = this.currentUser.friendRequests.filter(p => p.id !== friend.id);
    }

    getFriendsCurrentUser() {
        return this.currentUser.friends;
    }

    getFriendRequestsCurrentUser() {
        return this.currentUser.friendRequests;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getCurrentUserStats() {
        return this.currentUserStats;
    }

    isNotificationsEnabled() {
        if (this.currentUser !== undefined)
            return this.currentUser.notifEnabled;
    }

    setNotificationsEnabled() {
        this.currentUser.notifEnabled = !this.currentUser.notifEnabled;
        this.setCurrentUser(this.currentUser).then(
            p => {
                if (this.currentUser.notifEnabled)
                    this.toast.create('Notifications are enabled');
                else
                    this.toast.create('Notifications are disabled');
            }
        );
    }
}
