import { db, auth }
from "../../firebase/firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    doc,
    deleteDoc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const form =
document.querySelector("form");

form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const inputs =
        form.querySelectorAll("input");

        const author =
        inputs[0].value;

        const email =
        inputs[1].value;

        const message =
        form.querySelector("textarea").value;

        try{

            await addDoc(
                collection(
                    db,
                    "voxMessages"
                ),
                {
                    author,
                    email,
                    message,

                    reply: "",

                    created:
                    serverTimestamp()
                }
            );

            alert(
                "Vox přenos byl uložen."
            );

            form.reset();

        }

        catch(error){

            console.error(error);

            alert(
                "Přenos se nepodařilo uložit."
            );

        }

    }
);
const archive =
document.querySelector(
    "#vox-archive"
);

let isAdmin = false;

onAuthStateChanged(auth, (user) => {

    isAdmin = !!user;

    if(user){

    document.body.classList.add(
        "admin-mode"
    );

}

    loadMessages();

});

async function loadMessages(){

    const snapshot =
    await getDocs(

        query(
            collection(
                db,
                "voxMessages"
            ),
            orderBy(
                "created",
                "desc"
            )
        )

    );

    let html = "";

    snapshot.forEach(doc => {

        const msg =
        doc.data();

        html += `

<div class="vox-message">

    <div class="vox-author">
    ${msg.author || "Neznámý odesílatel"}
</div>

    <p>${msg.message}</p>

    ${
        msg.reply
        ?
        `<div class="vox-reply">
            <strong>Mechanicum:</strong>
            ${msg.reply}
        </div>`
        :
        ""
    }

    ${
        isAdmin
        ?
        `
        <textarea
            class="reply-input"
            data-id="${doc.id}"
            placeholder="Odpověď Mechanica...">${msg.reply || ""}</textarea>

        <button
            class="reply-button"
            data-id="${doc.id}">
            Uložit odpověď
        </button>
        <button
            class="delete-button"
            data-id="${doc.id}">
            Smazat zprávu
        </button>
        `
        :
        ""
    }

</div>

`;

});

    archive.innerHTML =
    html;

    if(isAdmin){

    document
    .querySelectorAll(".reply-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                const id =
                button.dataset.id;

                const reply =
                document.querySelector(
                    `.reply-input[data-id="${id}"]`
                ).value;

                await updateDoc(

                    doc(
                        db,
                        "voxMessages",
                        id
                    ),

                    {
                        reply
                    }

                );

                loadMessages();

            }
        );

    });

}
document
.querySelectorAll(".delete-button")
.forEach(button => {

    button.addEventListener(
        "click",
        async () => {

            const confirmed =
            confirm(
                "Opravdu smazat tuto Vox zprávu?"
            );

            if(!confirmed){
                return;
            }

            await deleteDoc(

                doc(
                    db,
                    "voxMessages",
                    button.dataset.id
                )

            );

            loadMessages();

        }
    );

});
}