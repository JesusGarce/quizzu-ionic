import {Injectable, NgZone} from '@angular/core';
import {auth} from 'firebase/app';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {FacebookLoginResponse} from '@ionic-native/facebook';
import * as firebase from 'firebase';
import {AngularFireStorage} from '@angular/fire/storage';
import {SpinnerLoadingService} from './spinner-loading/spinner-loading.service';
import {ToastService} from './toast-service';
import {UserService} from './user-service';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  userData: any;

  constructor(
      public ngFireAuth: AngularFireAuth,
      public router: Router,
      public ngZone: NgZone,
      private storage: AngularFireStorage,
      private spinnerLoading: SpinnerLoadingService,
      private toast: ToastService,
      private userService: UserService,
  ) {
    spinnerLoading.show();
    this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        // Cargamos los datos del usuario
        this.userService.initCurrentUser(user.uid);
        this.userService.initCurrentUserStats(user.uid);
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
      this.userService.createUser(user, result.user.uid);
    }).catch((error) => {
      this.toast.create('Something bad happened: ' + error);
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
      this.toast.create('Password reset email has been sent, please check your inbox.');
    }).catch((error) => {
          this.toast.create(error);
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
          this.userService.createUserFromDataGoogle(response.user).then(r => {
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
      this.userService.createUserFromDataGoogle(result.user).then(r => {
        this.spinnerLoading.hide();
      });
    }).catch((error) => {
      window.alert(error);
    });
  }

  SignOut() {
    return this.ngFireAuth.auth.signOut().then(() => {
      this.userService.removeCurrentUser();
      localStorage.removeItem('user');
      this.router.navigate(['start']);
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
}
