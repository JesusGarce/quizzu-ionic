import {Injectable} from '@angular/core';
import {User} from './user.model';
import {Router} from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {UserStats} from './user-stats.model';
import {SpinnerLoadingService} from './spinner-loading/spinner-loading.service';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {ToastService} from './toast-service';
import {UserMin} from './user-min.model';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    currentUser: any;
    currentUserStats: any;
    downloadURL: Observable<string>;
    profileDefaultImage = 'https://firebasestorage.googleapis.com/v0/b/quizzu-1fd29.appspot.com/o/profile%2Fdefault.png?alt=media&token=25150dc7-a848-4fce-b900-53f47a9518ee';

    constructor(
        public afStore: AngularFirestore,
        public router: Router,
        private storage: AngularFireStorage,
        private spinnerLoading: SpinnerLoadingService,
        private toast: ToastService,
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

    createUserFromDataGoogle(user) {
        const userStatsRef: AngularFirestoreDocument<any> = this.afStore.doc(`user-stats/${user.uid}`);
        userStatsRef.set(JSON.parse(JSON.stringify(this.currentUserStats)), {
            merge: true
        });
        const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.uid}`);
        const userData = new User(user.uid, user.email, user.displayName.toLowerCase(), user.photoURL);
        this.initCurrentUser(user.uid);
        return userRef.set(JSON.parse(JSON.stringify(userData)), {
            merge: true
        });
    }

    initCurrentUser(uid) {
        this.afStore.doc(`users/${uid}`).ref.get().then(doc => {
            if (doc.exists) {
                this.currentUser = doc.data();
            } else {
                this.toast.create('We can not find the user');
            }
        }).catch(err => {
            this.toast.create('Error getting document:' + err);
        });
    }

    initCurrentUserStats(uid) {
        this.afStore.doc(`user-stats/${uid}`).ref.get().then(doc => {
            if (doc.exists) {
                this.currentUserStats = doc.data();
            } else {
            }
        }).catch(err => {
            this.toast.create('Error getting document:' + err);
        });
    }

    removeCurrentUser() {
        this.currentUser = '';
    }

    goToEditProfile() {
        this.router.navigate(['home/profile/edit']);
    }

    setCurrentUser(editUser) {
        this.currentUser = editUser;
        return this.afStore.collection('users')
            .doc(this.currentUser.id)
            .set(JSON.parse(JSON.stringify(editUser)), {
                merge: true
            });
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
                            this.currentUser.profile = url;
                            this.spinnerLoading.hide();
                            return this.setCurrentUser(this.currentUser);
                        }
                    });
                })
            )
            .subscribe(url => {
            });
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
                friendUser.friends.push(new UserMin(this.currentUser.id, this.currentUser.username));
                this.afStore.collection('users')
                    .doc(friendUser.id)
                    .set(JSON.parse(JSON.stringify(friendUser)), {
                        merge: true
                    });
            }
        }).catch(err => {
            this.toast.create('Error getting document:' + err);
        });
    }

    sendFriendRequest(friend) {
        this.afStore.doc(`users/${friend.id}`).ref.get().then(doc => {
            if (doc.exists) {
                const friendUser = doc.data();
                friendUser.friendRequests.push(new UserMin(this.currentUser.id, this.currentUser.username));
                this.afStore.collection('users')
                    .doc(friendUser.id)
                    .set(JSON.parse(JSON.stringify(friendUser)), {
                        merge: true
                    });
                this.toast.create('Friend request sent');
            } else {
                this.toast.create('We can not find the user');
            }
        }).catch(err => {
            this.toast.create('Error getting document:' + err);
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
            this.toast.create('Error getting document:' + err);
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

    filterFriendRequests(friend) {
        this.currentUser.friendRequests = this.currentUser.friendRequests.filter(p => p.id !== friend.id);
    }
}
