import { auth }
from "../js/firebase.js";

import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

    if(!user){

        window.location.href =
        "adminLog.html";

        return;

    }

    const welcomeTitle =
    document.querySelector(
        "#welcome-title"
    );

    const ordersModule =
document.querySelector(
    "#module-orders"
);

const voxModule =
document.querySelector(
    "#module-vox"
);

const stockModule =
document.querySelector(
    "#module-stock"
);

    if(user.email === "linyvlk@gmail.com"){

        welcomeTitle.textContent =
        "⚙️ Vítejte, Magosi Wroxi ⚙️";

    }

    else if(
    user.email ===
    "ranshu@seznam.cz"
){

    welcomeTitle.textContent =
    "📜 Vítejte, kronikářko Sambria 📜";

    stockModule.style.display =
    "none";

}

    else{

        welcomeTitle.textContent =
        "⚙️ Vítejte, správce Luna Mechanica ⚙️";

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