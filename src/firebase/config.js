import firebase from 'firebase/app';
import 'firebase/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyClxVBab07KvyWIfTAyFaKXVsPv_K4XLFM",
    authDomain: "ga-iotmachine2019-cp4ver1.firebaseapp.com",
    databaseURL: "https://ga-iotmachine2019-cp4ver1.firebaseio.com",
    messagingSenderId: "729248643619",
    projectId: "ga-iotmachine2019-cp4ver1",
    storageBucket: "ga-iotmachine2019-cp4ver1.appspot.com"
});

const db = firebase.firestore();

export {db};