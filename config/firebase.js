const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Adjust the path accordingly

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://kaltengventura-4043c.appspot.com' // Replace with your actual bucket name
});

const bucket = admin.storage().bucket();
module.exports = bucket;
