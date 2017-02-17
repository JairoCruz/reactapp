import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import App from './App';
import './index.css';

firebase.initializeApp({
	apiKey: "AIzaSyAD-Pb03m_vfIejFICK7mG8LORnMeBjvUA",
    authDomain: "psgram-6fe15.firebaseapp.com",
    databaseURL: "https://psgram-6fe15.firebaseio.com",
    storageBucket: "psgram-6fe15.appspot.com",
    messagingSenderId: "448195395488"
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
