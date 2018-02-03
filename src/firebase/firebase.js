import * as firebase from 'firebase';

const devConfig = {
  apiKey: "AIzaSyAubH1g7zOTXU3v8bYLJjxL_WRfWMuGLQc",
  authDomain: "myexpenses-d80db.firebaseapp.com",
  databaseURL: "https://myexpenses-d80db.firebaseio.com",
  projectId: "myexpenses-d80db",
  storageBucket: "myexpenses-d80db.appspot.com",
  messagingSenderId: "629530944828"
};


const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export {
  db,
  auth,
};