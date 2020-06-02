import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Server} from './models/server.model';

@Injectable({
    providedIn: 'root'
})

export class ServerService {
    server: Server;

    constructor(
        public afStore: AngularFirestore,
    ) {
    }

    checkIfIsNewDay() {
        console.log('checkIfIsNewDay');
        this.getServer().then(
            data => {
                console.log(data);
                console.log(data.size);
                console.log(data.empty);
                if (data.empty) {
                    console.log('creating server...');
                    this.createServer().then();
                }
            }
        );
    }

    createServer() {
        const server = new Server(new Date(), new Date().getDay(), 0);
        return this.afStore.collection('server')
            .add(JSON.parse(JSON.stringify(server)));
    }

    getServer() {
        return this.afStore.collection('server').ref
            .where('day', '==', new Date().getDay())
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
