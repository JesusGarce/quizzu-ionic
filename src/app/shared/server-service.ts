import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})

export class ServerService {

    constructor(
        public afStore: AngularFirestore,
    ) {
    }

    getServer() {
        const date = new Date();
        return this.afStore.collection('server').ref
            .where('day', '==', date.getDay())
            .get();
    }

    updateApiCalls(server, serverId) {
        server.wordsApiCallsDaily ++;
        return this.afStore.collection('server')
            .doc(serverId)
            .set(JSON.parse(JSON.stringify(server)), {
                merge: true
            });
    }

}
