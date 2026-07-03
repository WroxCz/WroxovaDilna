import { auth, db }
from "../firebase/firebase.js";

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

onAuthStateChanged(auth, async (user) => {

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

   const userRef = doc(db, "users", user.uid);

const userSnap = await getDoc(userRef);

if(!userSnap.exists()){

    alert("Nemáte oprávnění ke vstupu.");

    await signOut(auth);

    return;

}

const userData = userSnap.data();

if(!userData.active){

    alert("Účet je deaktivovaný.");

    await signOut(auth);

    return;

}

welcomeTitle.textContent =
`⚙️ Vítejte, ${userData.name} ⚙️`;

switch(userData.role){

    case "magos":

        break;

    case "admin":

        stockModule.style.display = "none";

        break;

    default:

        alert("Neplatná role.");

        await signOut(auth);

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