import { auth, db }
from "./firebase.js";

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

export function checkAccess(callback){

    onAuthStateChanged(auth, async (user) => {

        if(!user){

            window.location.href =
                "../admin/adminLog.html";

            return;

        }

        const userRef =
            doc(db, "users", user.uid);

        const userSnap =
            await getDoc(userRef);

        if(!userSnap.exists()){

            alert("Nemáte oprávnění.");

            await signOut(auth);

            return;

        }

        const userData =
            userSnap.data();

        if(!userData.active){

            alert("Účet je deaktivovaný.");

            await signOut(auth);

            return;

        }

        callback(userData);

    });

}