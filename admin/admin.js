import { auth }
from "../firebase/firebase.js";

import {
    checkAccess
}
from "../firebase/authGuard.js";

import {
    doc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

checkAccess((userData) => {

    const welcomeTitle =
        document.querySelector(
            "#welcome-title"
        );

    const stockModule =
        document.querySelector(
            "#module-stock"
        );

    welcomeTitle.textContent =
        `⚙️ Vítejte, ${userData.name} ⚙️`;

    switch(userData.role){

        case "magos":

            break;

        case "admin":

            stockModule.style.display =
                "none";

            break;

        default:

            alert("Neplatná role.");

            return;

    }

});

const logoutButton =
document.querySelector("#logout-button");

logoutButton.addEventListener(
    "click",
    async () => {

        try{

            await signOut(auth);

            window.location.href =
            "adminLog.html";

        }

        catch(error){

            console.error(error);

            alert(
                "Odhlášení se nezdařilo."
            );

        }

    }
);