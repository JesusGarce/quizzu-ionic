import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {environment} from '../environments/environment';
import {AngularFireStorageModule, StorageBucket} from '@angular/fire/storage';

import {AuthenticationService} from './shared/authentication-service';
import {Facebook} from '@ionic-native/facebook/ngx';
import {EditImageProfileComponent} from './home/profile/edit-image-profile.component';
import {SpinnerLoadingComponent} from './shared/spinner-loading/spinner-loading.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {ToastService} from './shared/toast-service';
import {UserService} from './shared/user-service';

@NgModule({
  declarations: [AppComponent, EditImageProfileComponent, SpinnerLoadingComponent],
  entryComponents: [
      EditImageProfileComponent,
      SpinnerLoadingComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    OverlayModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthenticationService,
    ToastService,
    UserService,
    AngularFirestoreModule,
    Facebook,
    { provide: StorageBucket, useValue: 'gs://quizzu-1fd29.appspot.com/' }
  ],
  schemas: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
