import { auth }
from "../js/firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

    if(user){

        window.location.href =
        "admin.html";

    }

});

const form =
document.querySelector("#login-form");

form.addEventListener(
    "submit",
    async function(e){

        e.preventDefault();

        const email =
        document.querySelector(
            "#admin-email"
        ).value;

        const password =
        document.querySelector(
            "#admin-password"
        ).value;

        try{

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            window.location.href =
            "admin.html";

        }

        catch(error){

            alert(
                "Neplatný email nebo heslo."
            );

            console.error(error);

        }

    }
);