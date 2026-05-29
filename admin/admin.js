import { db }
from "../js/firebase.js";

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

        let html =
        "<h2>Objednávky</h2>";

        snapshot.forEach(doc => {

            const order =
            doc.data();

            html += `

            <div class="order-card">

                <h3>
                    ${order.model || "Neznámý model"}
                </h3>

                <p>
                    <strong>Jméno:</strong>
                    ${order.customerName || "-"}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${order.email || "-"}
                </p>

                <p>
                    <strong>Cena:</strong>
                    ${order.price || 0} Kč
                </p>

                <p>
                    <strong>Stav:</strong>
                    ${order.status || "-"}
                </p>

                <hr>

            </div>

            `;

        });

        adminPanel.innerHTML =
        html;

    }

    catch(error){

        console.error(error);

        adminPanel.innerHTML =

        "<p>Chyba při načítání objednávek.</p>";

    }

}