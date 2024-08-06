const admin = require('firebase-admin');
require("dotenv").config();

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error('The FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT); // Adjust the path accordingly

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'kaltengventura-4043c.appspot.com' // Replace with your actual bucket name
});

const bucket = admin.storage().bucket();
module.exports = bucket;
