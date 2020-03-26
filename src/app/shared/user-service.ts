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

@Injectable({
    providedIn: 'root'
})

export class UserService {
    currentUser: any;
    currentUserStats: any;
    downloadURL: Observable<string>;

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
        user.level = 1;
        user.points = 0;
        user.friends = [];
        user.profile = 'https://firebasestorage.googleapis.com/v0/b/quizzu-1fd29.appspot.com/o/profile%2Fdefault.png?alt=media&token=25150dc7-a848-4fce-b900-53f47a9518ee';
        this.createUserStats();
        const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.id}`);
        userRef.set(JSON.parse(JSON.stringify(user)), {
            merge: true
        });
        const userStatsRef: AngularFirestoreDocument<any> = this.afStore.doc(`user-stats/${user.id}`);
        userStatsRef.set(JSON.parse(JSON.stringify(this.currentUserStats)), {
            merge: true
        });
    }

    createUserStats() {
        this.currentUserStats = new UserStats();
        this.currentUserStats.c2level = {
            c2played: 0,
            c2won: 0,
            c2draw: 0,
            c2lost: 0,
        };
        this.currentUserStats.c1level = {
            c1played: 0,
            c1won: 0,
            c1draw: 0,
            c1lost: 0,
        };
        this.currentUserStats.b2level = {
            b2played: 0,
            b2won: 0,
            b2draw: 0,
            b2lost: 0,
        };
        this.currentUserStats.b1level = {
            b1played: 0,
            b1won: 0,
            b1draw: 0,
            b1lost: 0,
        };
    }

    createUserFromDataGoogle(user) {
        const userStatsRef: AngularFirestoreDocument<any> = this.afStore.doc(`user-stats/${user.uid}`);
        userStatsRef.set(JSON.parse(JSON.stringify(this.currentUserStats)), {
            merge: true
        });
        const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.uid}`);
        const userData: User = {
            id: user.uid,
            email: user.email,
            username: user.displayName,
            profile: user.photoURL,
            points: 0,
            level: 1,
            firstName: '',
            lastName: '',
            birthDate: new Date(),
            friends: []
        };
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

    getUsername(id) {
        this.afStore.doc(`users/${id}`).ref.get().then(doc => {
            if (doc.exists) {
                console.log('get user; ' + doc.data().username);
                return doc.data().username;
            } else {
                return false;
            }
        }).catch(err => {
            return false;
        });
    }

    removeCurrentUser() {
        this.currentUser = new User();
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

}
