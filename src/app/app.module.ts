import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';

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
import {MatchService} from './shared/match-service';
import {SearchModalUserPageModule} from './home/friends/search-modal-user/search-modal-user.module';
import {LottieAnimationViewModule} from 'ng-lottie';
import {SelectLevelModalPageModule} from './home/game/select-level-modal/select-level-modal.module';
import {CountdownStartPageModule} from './home/game/match/countdown-start/countdown-start.module';
import {SearchOpponentPageModule} from './home/game/match/search-opponent/search-opponent.module';
import {MatchWordsApiService} from './shared/match-wordsapi-service';
import {FinishMatchPageModule} from './home/game/match/finish-match/finish-match.module';
import {NotificationsPageModule} from './home/notifications/notifications.module';
import {NotificationService} from './shared/notification-service';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {FinishPractisePageModule} from './home/game/practise/finish-practise/finish-practise.module';
import {SettingsPageModule} from './home/profile/settings/settings.module';

@NgModule({
    declarations: [AppComponent, EditImageProfileComponent, SpinnerLoadingComponent],
    entryComponents: [
        EditImageProfileComponent,
        SpinnerLoadingComponent,
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        LottieAnimationViewModule.forRoot(),
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AngularFirestoreModule,
        AngularFireStorageModule,
        OverlayModule,
        SearchModalUserPageModule,
        SelectLevelModalPageModule,
        CountdownStartPageModule,
        SearchOpponentPageModule,
        FinishMatchPageModule,
        FinishPractisePageModule,
        SettingsPageModule,
        NotificationsPageModule,
        HttpClientModule,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        AuthenticationService,
        ToastService,
        UserService,
        MatchService,
        MatchWordsApiService,
        NotificationService,
        AngularFirestoreModule,
        Facebook,
        LocalNotifications,
        {provide: StorageBucket, useValue: 'gs://quizzu-1fd29.appspot.com/'}
    ],
    schemas: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
