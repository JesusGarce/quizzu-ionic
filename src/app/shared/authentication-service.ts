import { Injectable, NgZone } from '@angular/core';
import { auth } from 'firebase/app';
import { User } from './user.model';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import {FacebookLoginResponse} from '@ionic-native/facebook';
import * as firebase from 'firebase';
import {Observable} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {UserStats} from './user-stats.model';
import {SpinnerLoadingComponent} from './spinner-loading/spinner-loading.component';
import {SpinnerLoadingService} from './spinner-loading/spinner-loading.service';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  userData: any;
  currentUser: any;
  currentUserStats: any;
  downloadURL: Observable<string>;

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private storage: AngularFireStorage,
    private spinnerLoading: SpinnerLoadingService,
  ) {
    spinnerLoading.show();
    this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        this.getCurrentUser(user.uid);
        this.getCurrentUserStats(user.uid);
        JSON.parse(localStorage.getItem('user'));
        spinnerLoading.hide();
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
        spinnerLoading.hide();
      }
    });
  }

  // Login in with email/password
  SignIn(email, password) {
    return this.ngFireAuth.auth.signInWithEmailAndPassword(email, password);
  }

  // Register user with email/password
  RegisterUser(user, password) {
    return this.ngFireAuth.auth.createUserWithEmailAndPassword(user.email, password).
        then(result => {
          user.id = result.user.uid;
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
    }).catch((error) => {
      window.alert('Something bad happened: ' + error);
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

  // Email verification when new user register
  SendVerificationMail() {
    return this.ngFireAuth.auth.currentUser.sendEmailVerification()
    .then(() => {
      this.router.navigate(['verify-email']);
    });
  }

  // Recover password
  PasswordRecover(passwordResetEmail) {
    return this.ngFireAuth.auth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email has been sent, please check your inbox.');
    }).catch((error) => {
      window.alert(error);
    });
  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.emailVerified !== false) ? true : false;
  }

  // Sign in with Gmail
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }
  
  // Sign in with Facebook
  FacebookAuth(res: FacebookLoginResponse) {
    this.spinnerLoading.show();
    const credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
    this.ngFireAuth.auth.signInWithCredential(credential)
        .then((response) => {
          this.SetUserDataGoogle(response.user).then( r => {
            this.spinnerLoading.hide();
          });
          this.router.navigate(['/home']);
        });
  }

  // Auth providers
  AuthLogin(provider) {
    this.spinnerLoading.show();
    return this.ngFireAuth.auth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          this.router.navigate(['home']);
        });
       this.SetUserDataGoogle(result.user).then( r => {
        this.spinnerLoading.hide();
      });
    }).catch((error) => {
      window.alert(error);
    });
  }

  // Store user in localStorage
  SetUserDataGoogle(user) {
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
    this.getCurrentUser(user.uid);
    return userRef.set(JSON.parse(JSON.stringify(userData)), {
      merge: true
    });
  }

  SignOut() {
    return this.ngFireAuth.auth.signOut().then(() => {
      this.removeCurrentUser();
      localStorage.removeItem('user');
      this.router.navigate(['start']);
    });
  }

  getCurrentUser(uid) {
    this.afStore.doc(`users/${uid}`).ref.get().then(doc => {
      if (doc.exists) {
        this.currentUser = doc.data();
      } else {
      }
    }).catch(err => {
      console.log('Error getting document:' + err);
    });
  }

  getCurrentUserStats(uid) {
    this.afStore.doc(`user-stats/${uid}`).ref.get().then(doc => {
      if (doc.exists) {
        this.currentUserStats = doc.data();
      } else {
      }
    }).catch(err => {
      console.log('Error getting document:' + err);
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

  checkCurrentPassword(password) {
    const credentials = firebase.auth.EmailAuthProvider.credential(
        this.userData.email, password);

    return this.userData.reauthenticateWithCredential(credentials);
  }

  setPassword(password) {
    return this.userData.updatePassword(password);
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
        .subscribe(url => {});
  }

}
