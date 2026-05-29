import { db } from "../js/firebase.js";

import {
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const adminPanel =
document.querySelector("#admin-panel");

loadOrders();

async function loadOrders(){

    try{

        const snapshot =
        await getDocs(
            collection(db, "orders")
        );

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

                <p>
                    <strong>ID:</strong>
                    ${id}
                </p>

                <p>
                    <strong>Datum:</strong>
                    ${created}
                </p>

                <p>
                    <strong>Jméno:</strong>
                    ${order.customerName || "-"}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${order.email || "-"}
                </p>

                <p>
                    <strong>Telefon:</strong>
                    ${order.phone || "-"}
                </p>

                <p>
                    <strong>Cena:</strong>
                    ${order.price || 0} Kč
                </p>

                <p>
                    <strong>Stav:</strong>
                    ${order.status || "-"}
                </p>

                <p>
                    <strong>Materiál:</strong>
                    ${order.material || "-"}
                </p>

                <p>
                    <strong>Výrobce:</strong>
                    ${order.manufacturer || "-"}
                </p>

                <p>
                    <strong>Doručení:</strong>
                    ${order.delivery || "-"}
                </p>

                <p>
                    <strong>Poznámka:</strong>
                    ${order.note || "-"}
                </p>

                <button
                    class="edit-button"
                    data-id="${id}">
                    Upravit
                </button>

                <hr>

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