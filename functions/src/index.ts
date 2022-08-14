import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

const cors = require('cors')({
  origin: ['http://localhost:4200', 'https://universe-canvas.web.app/'],
});

export const helloWorld = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    functions.logger.info('Hello logs!', { structuredData: true });
    response.send({ data: { test: 'hello' } });
  });
});
