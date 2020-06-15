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
import {MatchService} from './match-service';
import {Messages} from './messages';
import {Platform} from '@ionic/angular';

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
      private matchService: MatchService,
      private platform: Platform,
  ) {
    spinnerLoading.show();
    this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        this.initUser(user.uid);
      } else {
        localStorage.setItem('user', null);
        this.router.navigate(['start']);
      }
      spinnerLoading.hide();
    });

    if (!this.platform.is('desktop')) {
      this.ngFireAuth.auth.getRedirectResult().then(result => {
        const user = result.user;
        let isNewUser = false;
        if (user !== undefined)
          isNewUser = result.additionalUserInfo.isNewUser;
        if (isNewUser) {
          this.userService.signInFromOAuth(user);
        } else {
          this.userService.logInFromOAuth(user);
        }
      }).catch(err => {
        console.log(err);
        this.spinnerLoading.hide();
      });
    }
  }

  signInWithEmailAndPassword(email, password) {
    return this.ngFireAuth.auth.signInWithEmailAndPassword(email, password);
  }

  registerUser(user, password) {
    return this.ngFireAuth.auth.createUserWithEmailAndPassword(user.email, password).
    then(result => {
      this.userService.createUser(user, result.user.uid);
      this.spinnerLoading.hide();
      this.sendVerificationMail().then(() => {
        this.router.navigate(['verify-email']).then();
      });
    }).catch((err) => {
      this.toast.create(Messages.ERROR + ':' + err);
    });
  }

  sendVerificationMail() {
    return this.ngFireAuth.auth.currentUser.sendEmailVerification();
  }

  passwordRecover(passwordResetEmail) {
    return this.ngFireAuth.auth.sendPasswordResetEmail(passwordResetEmail)
        .then(() => {
          this.toast.create(Messages.PASSWORD_CHANGE_REQUEST_SENT);
        }).catch((err) => {
          this.toast.create(Messages.ERROR + ':' + err);
        });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false);
  }

  getLoggedData() {
    return JSON.parse(localStorage.getItem('user'));
  }

  signInWithGoogleAuth() {
    this.authGoogleLogin(new auth.GoogleAuthProvider());
  }

  facebookAuth(res: FacebookLoginResponse) {
    this.spinnerLoading.show();
    const credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
    this.ngFireAuth.auth.signInWithCredential(credential)
        .then((result) => {
          const user = result.user;
          const isNewUser = result.additionalUserInfo.isNewUser;
          if (isNewUser) {
            this.userService.signInFromOAuth(user);
            this.ngZone.run(() => {
              this.router.navigate(['enter-username']).then();
            });
          } else {
            this.userService.logInFromOAuth(user);
          }
        }).catch((err) => {
      this.spinnerLoading.hide();
      this.toast.create(Messages.ERROR + ':' + err);
    });
  }

  authGoogleLogin(provider) {
    this.spinnerLoading.show();
    if (this.platform.is('desktop')) {
      this.ngFireAuth.auth.signInWithPopup(provider)
          .then((result) => {
            const user = result.user;
            const isNewUser = result.additionalUserInfo.isNewUser;
            if (isNewUser) {
              this.userService.signInFromOAuth(user);
              this.ngZone.run(() => {
                this.router.navigate(['enter-username']).then();
              });
            } else {
              this.userService.logInFromOAuth(user);
            }
          }).catch((err) => {
            this.spinnerLoading.hide();
            this.toast.create(Messages.ERROR + ':' + err);
          });
    } else {
      this.ngFireAuth.auth.signInWithRedirect(provider)
          .then(() => {});
    }
  }

  signOut() {
    return this.ngFireAuth.auth.signOut().then(() => {
      this.userService.removeCurrentUser();
      this.matchService.removeMatches();
      localStorage.clear();
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

  initUser(uid) {
    this.userService.getUser(uid).then(
        user => {
          if (user.exists) {
            this.userService.initCurrentUser(uid);
            this.userService.initCurrentUserStats(uid);
            this.matchService.initMatches(uid);
          } else {
            this.signOut().then();
            this.router.navigate(['start']).then();
          }
        }
    );
  }
}
