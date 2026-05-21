import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyDx5aAcfQcRmb7JNDABe-CTphZwZ_xpoSA",

  authDomain: "wrox-61299.firebaseapp.com",

  projectId: "wrox-61299",

  storageBucket: "wrox-61299.firebasestorage.app",

  messagingSenderId: "769685871738",

  appId: "1:769685871738:web:d99cecf98fe3b3f756afc3",

  measurementId: "G-D7E49VBHH8"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const archive = document.getElementById("vox-archive");

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.querySelector('input[type="text"]').value;

    const email = document.querySelector('input[type="email"]').value;

    const message = document.querySelector("textarea").value;

    try {

        await addDoc(collection(db, "voxMessages"), {

            name: name,

            email: email,

            message: message,

            created: new Date()
        });

        alert("Vox přenos uložen.");

        form.reset();

        loadMessages();

    } catch (error) {

        console.error(error);

        alert("Chyba vox přenosu.");
    }
});
async function loadMessages() {

    archive.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "voxMessages"));

    querySnapshot.forEach((doc) => {

        const data = doc.data();

        const messageDiv = document.createElement("div");

        messageDiv.classList.add("vox-message");

        messageDiv.innerHTML = `

    <div class="vox-author">
        ${data.name}
    </div>

    <div>
        ${data.message}
    </div>

    ${
        data.reply
        ?
        `
        <div class="vox-reply">

            <strong>Odpověď dílny:</strong>

            <br><br>

            ${data.reply}

        </div>
        `
        :
        ""
    }
`;

        archive.appendChild(messageDiv);

});

setTimeout(() => {

    archive.scrollTop = archive.scrollHeight;

}, 100);

}

loadMessages();