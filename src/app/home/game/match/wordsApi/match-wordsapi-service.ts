import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {SpinnerLoadingService} from '../../../../shared/spinner-loading/spinner-loading.service';
import {ToastService} from '../../../../shared/toast-service';
import {UserService} from '../../../../shared/user-service';
import {AlertController, ModalController} from '@ionic/angular';
import {MatchService} from '../../../../shared/match-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class MatchWordsApiService {
    word: string;
    definition: string;
    match: any;

    url: string;
    key: string;
    host: string;

    constructor(
        public router: Router,
        private spinnerLoading: SpinnerLoadingService,
        private toast: ToastService,
        private modalController: ModalController,
        private matchService: MatchService,
        private alertController: AlertController,
        private http: HttpClient,
    ) {
        this.match = this.matchService.currentMatch;
        this.url = 'https://wordsapiv1.p.rapidapi.com/words/';
        this.key = '2dc9e6db57msh837e91dd74078bep1d999ejsn867a5d2bf2fb';
        this.host =  'wordsapiv1.p.rapidapi.com';
    }


    getDefinition(word) {
        const headers = new HttpHeaders()
            .set('content-type', 'application/json')
            .set('Access-Control-Allow-Origin', '*')
            .set('x-rapidapi-host', this.host)
            .set('x-rapidapi-key', this.key);

        console.log('Holi' + word);
        console.log('URL: ' + this.url + word + '/definitions');

        return this.http.get(this.url + word + '/definitions', { 'headers': headers });
    }

}
