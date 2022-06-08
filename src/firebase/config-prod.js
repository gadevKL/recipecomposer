import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
// import {getStorage} from 'firebase/storage';

var production = firebase.initializeApp({
    apiKey: "AIzaSyDiczgMPdvhTIaOMhtq62l2-4Wn3GP4F5Q",
    authDomain: "schpi-productionsys-cp2ver1.firebaseapp.com",
    databaseURL: "https://schpi-productionsys-cp2ver1.firebaseio.com",
    projectId: "schpi-productionsys-cp2ver1",
    storageBucket: "schpi-productionsys-cp2ver1.appspot.com",
    messagingSenderId: "839116673807",
},'production');

const dbP = production.firestore();

export {dbP};