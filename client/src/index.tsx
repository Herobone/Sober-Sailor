import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase';
import config from './helper/config'
import App from './App';

// Initialize Firebase with the config
// Configure in helper/config.ts
firebase.initializeApp(config);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// If running local use Emulators for testing!
// Make sure to start those with "firebase emulators:start"
if (window.location.hostname === "localhost") {
    firebase.firestore().useEmulator("localhost", 8080);
    firebase.auth().useEmulator("http://localhost:9099");
    firebase.functions().useEmulator("localhost", 5001);
}

ReactDOM.render(
  <App />,
    // Get the "root" Element from index.html
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
