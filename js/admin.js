import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
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

const auth = getAuth(app);

const db = getFirestore(app);



const loginForm =
    document.getElementById("login-form");

const adminPanel =
    document.getElementById("admin-panel");

const logoutButton =
    document.getElementById("logout-button");



loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("admin-email").value;

    const password =
        document.getElementById("admin-password").value;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

    } catch (error) {

        console.error(error);

        alert("Neplatné přihlášení");
    }
});



logoutButton.addEventListener("click", async () => {

    await signOut(auth);

    location.reload();
});



onAuthStateChanged(auth, (user) => {

    if (user) {

    loginForm.style.display = "none";

    logoutButton.style.display = "block";

    adminPanel.style.display = "block";

    loadMessages();

} else {

    loginForm.style.display = "flex";

    logoutButton.style.display = "none";

    adminPanel.style.display = "none";

    adminPanel.innerHTML = "";
}
});



async function loadMessages() {
    console.log("LOAD MESSAGES");

    adminPanel.innerHTML = "";

    const querySnapshot =
        await getDocs(collection(db, "voxMessages"));



    querySnapshot.forEach((messageDoc) => {
        console.log(messageDoc.data());

        const data = messageDoc.data();

        const box = document.createElement("div");

        box.classList.add("vox-message");



        box.innerHTML = `

            <div class="vox-author">
                ${data.name}
            </div>

            <div>
                ${data.email}
            </div>

            <br>

            <div>
                ${data.message}
            </div>

            <br>

            <textarea
                class="reply-input"
                placeholder="Odpověď admina">${data.reply || ""}</textarea>

            <div class="admin-buttons">

                <button class="reply-button">
                    Odeslat odpověď
                </button>

                <button class="delete-button">
                    Smazat zprávu
                </button>

            </div>

            <hr>
        `;



        adminPanel.appendChild(box);



        const replyButton =
            box.querySelector(".reply-button");



        replyButton.addEventListener("click", async () => {

            const replyText =
                box.querySelector(".reply-input").value;

            try {

                await updateDoc(
                    doc(db, "voxMessages", messageDoc.id),
                    {
                        reply: replyText
                    }
                );

                alert("Odpověď uložena.");

            } catch (error) {

                console.error(error);

                alert("Chyba ukládání.");
            }
        });




        const deleteButton =
            box.querySelector(".delete-button");



        deleteButton.addEventListener("click", async () => {

            const confirmDelete =
                confirm("Smazat zprávu?");

            if (!confirmDelete) return;

            try {

                await deleteDoc(
                    doc(db, "voxMessages", messageDoc.id)
                );

                box.remove();

            } catch (error) {

                console.error(error);

                alert("Chyba mazání.");
            }
        });

    });
}