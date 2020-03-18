import { Injectable, NgZone } from '@angular/core';
import { auth } from 'firebase/app';
import { User } from './user.model';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import {FacebookLoginResponse} from '@ionic-native/facebook';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  userData: any;
  currentUser: any;

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        this.saveCurrentUser(user.uid);
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
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
          user.profile = '';
          const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.id}`);
          userRef.set(JSON.parse(JSON.stringify(user)), {
                merge: true
          });
    }).catch((error) => {
      window.alert('Something bad happened: ' + error);
    });
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
    const credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
    this.ngFireAuth.auth.signInWithCredential(credential)
        .then((response) => {
          this.SetUserDataGoogle(response.user);
          this.router.navigate(['/home']);
        });
  }

  // Auth providers
  AuthLogin(provider) {
    return this.ngFireAuth.auth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          this.router.navigate(['home']);
        });
       this.SetUserDataGoogle(result.user);
    }).catch((error) => {
      window.alert(error);
    });
  }

  // Store user in localStorage
  SetUserDataGoogle(user) {
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
    this.saveCurrentUser(user.uid);
    return userRef.set(userData, {
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

  saveCurrentUser(uid) {
    console.log(uid);
    this.afStore.doc(`users/${uid}`).ref.get().then(doc => {
      if (doc.exists) {
        this.currentUser = doc.data();
        console.log('CURRENT USER SAVED: ' + this.currentUser);
      } else {
        console.log('No such document!');
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

  }

}
