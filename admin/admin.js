import { db } from "../js/firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy
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
        data-id="${id}">
        Upravit
    </button>

</div>

`;            
        });

        adminPanel.innerHTML =
        html;

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

            button.textContent =
            "Edituji...";

        }
    );

});
    }

    catch(error){

        console.error(error);

        adminPanel.innerHTML =
        "<p>Chyba při načítání objednávek.</p>";

    }

}