const admin = require('firebase-admin');
const serviceAccount = require('../config/firebase-service-account-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'mmhhg-ef0e9.appspot.com'
});

const bucket = admin.storage().bucket();

module.exports = bucket;
