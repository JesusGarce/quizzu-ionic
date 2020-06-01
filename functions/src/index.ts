import * as functions from 'firebase-functions';
import {Server} from '../../src/app/shared/models/server.model';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

const admin = require('firebase-admin');
admin.initializeApp();

const cors = require("cors")({ origin: true });

exports.hiWorld = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.send({text:"Hello from Firebase!"});
    });
});

exports.createServer = functions.pubsub.schedule("every 2 minutes")
    .onRun(async () => {
        const server = new Server(new Date(), new Date().getDay(), 0);
        const serverResp = await admin.firestore().collection('server').add(JSON.parse(JSON.stringify(server)));

        await Promise.all(serverResp.docs.map((doc: any) => doc.ref.update({overdue: true})));
    });

