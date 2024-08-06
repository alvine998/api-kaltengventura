const admin = require('firebase-admin');
require("dotenv").config();
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT); // Adjust the path accordingly

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://kaltengventura-4043c.appspot.com' // Replace with your actual bucket name
});

const bucket = admin.storage().bucket();
module.exports = bucket;
