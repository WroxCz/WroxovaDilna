import { db } from "../js/firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    updateDoc,
    deleteDoc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const adminPanel =
document.querySelector("#admin-panel");

loadOrders();

async function loadOrders(){

    try{

        const q = query(
    collection(db, "orders"),
    orderBy("created", "desc")
);

const snapshot =
await getDocs(q);

        let html = "";

        snapshot.forEach(doc => {

            const order =
            doc.data();

            const id =
            doc.id;

            let created = "-";

if(order.created){

    created =
    order.created
    .toDate()
    .toLocaleString("cs-CZ");

}
html += `

<div
    class="order-card"
    data-id="${id}">

    <h3>
        ${order.model || "Neznámý model"}
    </h3>

    <div class="order-price">
        ${order.price || 0} Kč
    </div>

    <div class="order-badges">

        <span class="badge badge-status">
            ${order.status}
        </span>

        <span class="badge badge-payment">
            ${order.paymentStatus}
        </span>

    </div>

    <p class="order-date">
    ${created}
</p>

<p class="order-id">
    ID: ${id}
</p>

<div class="order-section">

    <div class="two-columns">

        <div>

            <div class="order-section-title">
                Zákazník
            </div>

            <p>${order.customerName || "-"}</p>

            <p>${order.email || "-"}</p>

            <p>${order.phone || "-"}</p>

        </div>

        <div>

            <div class="order-section-title">
                Doručení
            </div>

            <p>${order.delivery || "-"}</p>

        </div>

    </div>

</div>

    <div class="order-section">

    <div class="order-section-title">
        Výroba
    </div>

    <p>
        ${order.quantity || 1} ks •
        ${order.material || "-"}
        ${order.variant || "-"}
    </p>

    <p>
        ${order.manufacturer || "-"}
    </p>

    <p>
        ${order.color || "-"}
    </p>

</div>

    <div class="order-section">

        <div class="order-section-title">
            Poznámka zákazníka
        </div>

        <p>${order.note || "-"}</p>

    </div>

    <div class="order-section">

        <div class="order-section-title">
            Interní poznámka
        </div>

        <p>${order.adminNote || "-"}</p>

    </div>

    <button
    class="edit-button"
    data-id="${id}"
    data-price="${order.price || 0}"
    data-status="${order.status || "Nová"}"
    data-payment="${order.paymentStatus || "Nezaplaceno"}"
    data-note="${order.adminNote || ""}">
    Upravit
    </button>

</div>

`;            
        });

        adminPanel.innerHTML =
        html;

        document
document
.querySelectorAll(".edit-button")
.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const card =
            button.closest(".order-card");

            card.style.border =
            "2px solid #d6a55c";

            const currentPrice =
            button.dataset.price;

            const currentStatus =
            button.dataset.status;

            const currentPayment =
            button.dataset.payment;

            const currentNote =
            button.dataset.note;

            button.insertAdjacentHTML(
                "beforebegin",

                `
                <div class="edit-form">

                    <input
                        class="edit-price"
                        type="number"
                        value="${currentPrice}">

                    <select
                        class="edit-status">

                        <option ${currentStatus === "Nová" ? "selected" : ""}>
                            Nová
                        </option>

                        <option ${currentStatus === "Potvrzená" ? "selected" : ""}>
                            Potvrzená
                        </option>

                        <option ${currentStatus === "Ve výrobě" ? "selected" : ""}>
                            Ve výrobě
                        </option>

                        <option ${currentStatus === "Hotovo" ? "selected" : ""}>
                            Hotovo
                        </option>

                    </select>

                    <select
                        class="edit-payment">

                        <option ${currentPayment === "Nezaplaceno" ? "selected" : ""}>
                            Nezaplaceno
                        </option>

                        <option ${currentPayment === "Zaplaceno" ? "selected" : ""}>
                            Zaplaceno
                        </option>

                    </select>

                    <textarea
                        class="edit-note"
                        rows="4">${currentNote}</textarea>

                    <button
                        class="delete-button">
                        Smazat
                    </button>

                    <button
                        class="save-button">
                        Uložit
                    </button>

                    

                </div>
                `
            );

            button.remove();

        }
    );
});

document
.addEventListener(
    "click",
    async function(e){

        if(
            !e.target.classList.contains(
                "save-button"
            )
        ){
            return;
        }

        const form =
        e.target.closest(".edit-form");

        const card =
        e.target.closest(".order-card");

        const id =
        card.dataset.id;

        try{

            await updateDoc(

                doc(
                    db,
                    "orders",
                    id
                ),

                {
                    price: Number(
                        form.querySelector(
                            ".edit-price"
                        ).value
                    ),

                    status:
                    form.querySelector(
                        ".edit-status"
                    ).value,

                    paymentStatus:
                    form.querySelector(
                        ".edit-payment"
                    ).value,

                    adminNote:
                    form.querySelector(
                        ".edit-note"
                    ).value
                }

            );

            loadOrders();

        }

        catch(error){

            console.error(error);

            alert(
                "Nepodařilo se uložit změny."
            );

        }

    }
);
document.addEventListener(
    "click",
    async function(e){

        if(
            !e.target.classList.contains(
                "delete-button"
            )
        ){
            return;
        }

        const card =
        e.target.closest(".order-card");

        const id =
        card.dataset.id;

        if(
            !confirm(
                "Opravdu smazat objednávku?"
            )
        ){
            return;
        }

        try{

            await deleteDoc(
                doc(
                    db,
                    "orders",
                    id
                )
            );

            loadOrders();

        }

        catch(error){

            console.error(error);

            alert(
                "Smazání selhalo."
            );

        }

    }
);
    }

    catch(error){

        console.error(error);

        adminPanel.innerHTML =
        "<p>Chyba při načítání objednávek.</p>";

    }

}