import { db }
from "../../../firebase/firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const container =
document.getElementById(
    "orders-list"
);

loadOrders();

async function loadOrders(){

    const q =
        query(
            collection(db, "orders"),
            orderBy("created", "desc")
        );

    const snapshot =
        await getDocs(q);

    container.innerHTML = "";

    snapshot.forEach(orderDoc => {

        const order =
            orderDoc.data();

        container.innerHTML += `

<div
    class="order-card"
    data-id="${orderDoc.id}"
    onclick="openOrder('${orderDoc.id}')">

    <div class="order-number">

        ${order.orderNumber}

    </div>

    <div class="order-status">

        ${order.status}

    </div>

</div>

        `;

    });

}
function openOrder(id){

    window.location.href =
    `../zakazka/zakazka.html?id=${id}`;

}

window.openOrder = openOrder;