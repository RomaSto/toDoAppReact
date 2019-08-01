import * as firebase from 'firebase';
import ReduxSagaFirebase from 'redux-saga-firebase';

const API_KEY = 'AIzaSyB3wXXsXZ-aUc0N5Jb3SvHyD-4P0WVshX4';
const AUTH_DOMAIN = 'react-to-do-141c4.firebaseapp.com';
const DATABASE_URL = 'https://react-to-do-141c4.firebaseio.com';
const PROJECT_ID = 'react-to-do-141c4';
const MESSAGING_SENDER_ID = '914758193361';

const prodConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: '',
  messagingSenderId: MESSAGING_SENDER_ID,
};

const devConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: '',
  messagingSenderId: MESSAGING_SENDER_ID,
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const reduxSagaFirebase = new ReduxSagaFirebase(firebase);

const db = firebase.database();
const auth = firebase.auth();

export { db, auth, reduxSagaFirebase };
// export default reduxSagaFirebase;
