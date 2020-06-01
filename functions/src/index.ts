import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

const cors = require("cors")({ origin: true });
let callWordsAPICount = 0;

exports.hiWorld = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.send({text:"Hello from Firebase!"});
    });
});

exports.callCounts = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        response.setHeader('Access-Control-Allow-Origin', '*');
        callWordsAPICount ++;
        if (callWordsAPICount < 2500) {
            response.send({available:true, count:callWordsAPICount});
        }
        else {
            response.send({available:false, count:callWordsAPICount})
        }
    });
});
