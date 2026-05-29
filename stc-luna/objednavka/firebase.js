// Firebase

import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyDx5aAcfQcRmb7JNDABe-CTphZwZ_xpoSA",

    authDomain: "wrox-61299.firebaseapp.com",

    projectId: "wrox-61299",

    storageBucket: "wrox-61299.firebasestorage.app",

    messagingSenderId: "769685871738",

    appId: "1:769685871738:web:d99cecf98fe3b3f756afc3"

};

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

export { db };