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

@Injectable({
    providedIn: 'root'
})

export class UserStatsService {
    currentUserStats: any;

    constructor(
        public afStore: AngularFirestore,
        public ngFireAuth: AngularFireAuth,
        public router: Router,
        public ngZone: NgZone,
        private storage: AngularFireStorage
    ) {

    }

}
