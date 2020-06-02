import * as functions from 'firebase-functions';

const cors = require('cors')({origin: true});

exports.hiWorld = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.send({text: 'Hello from Firebase!'});
    });
});


/*
exports.createServer = functions.pubsub.schedule('every 2 minutes')
    .onRun(async () => {
        const server = new Server(new Date(), new Date().getDay(), 0);
        const serverResp = await admin.firestore().collection('server').add(JSON.parse(JSON.stringify(server)));

        await Promise.all(serverResp.docs.map((doc: any) => doc.ref.update({overdue: true})));
    });
 */
