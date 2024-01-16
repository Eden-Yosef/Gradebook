// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

// import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js';
// import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-analytics.js';
// import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';


const firebaseConfig = {
    apiKey: "AIzaSyABK01CCOHParlIfm83bhQqPgjKMMhTWJA",
    authDomain: "project-gradebook-40517.firebaseapp.com",
    projectId: "project-gradebook-40517",
    storageBucket: "project-gradebook-40517.appspot.com",
    messagingSenderId: "170598527890",
    appId: "1:170598527890:web:32bb88ea3c91fad68b474b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
