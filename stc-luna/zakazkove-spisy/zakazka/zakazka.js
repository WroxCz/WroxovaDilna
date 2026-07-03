import { db }
from "../../../firebase/firebase.js";

import {
    doc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const params =
    new URLSearchParams(
        window.location.search
    );

const id =
    params.get("id");

if(!id){

    alert("Chybí ID zakázky.");

    throw new Error("Missing order id");

}

loadOrder();

async function loadOrder(){

    const orderRef =
        doc(
            db,
            "orders",
            id
        );

    const snapshot =
        await getDoc(orderRef);

    if(!snapshot.exists()){

        alert("Zakázka nebyla nalezena.");

        return;

    }

    const order =
        snapshot.data();

    document.getElementById(
        "order-number"
    ).textContent =
        order.orderNumber;
     
    document.getElementById(
    "overview"
).innerHTML = `

<b>Číslo zakázky:</b>
${order.orderNumber}

<br><br>

<b>Stav:</b>
${order.status}

<br><br>

<b>Vytvořeno:</b>
${order.created?.toDate().toLocaleString("cs-CZ") ?? "-"}

`;        

document.getElementById(
    "customer"
).innerHTML = `

<b>Jméno:</b>
${order.customer.name}

<br><br>

<b>E-mail:</b>
${order.customer.email}

<br><br>

<b>Telefon:</b>
${order.customer.phone}

<br><br>

<b>Ulice:</b>
${order.customer.street}

<br><br>

<b>Město:</b>
${order.customer.city}

<br><br>

<b>PSČ:</b>
${order.customer.zip}

`;
let itemsHtml = "";

order.items.forEach(item => {

    itemsHtml += `

<div style="margin-bottom:25px;">

    <h3>${item.productName}</h3>

    <b>Květ</b><br>

    Materiál: ${item.config.flower.material}<br>
    Varianta: ${item.config.flower.variant}<br>
    Barva: ${item.config.flower.color}<br>
    Kusů: ${item.config.flower.quantity}

    <br><br>

    <b>Stonek</b><br>

    Materiál: ${item.config.stem.material}<br>
    Varianta: ${item.config.stem.variant}<br>
    Barva: ${item.config.stem.color}<br>
    Kusů: ${item.config.stem.quantity}

    <br><br>

    <b>List</b><br>

    Materiál: ${item.config.leaf.material}<br>
    Varianta: ${item.config.leaf.variant}<br>
    Barva: ${item.config.leaf.color}<br>
    Kusů: ${item.config.leaf.quantity}

    <br><br>

    <b>Počet výrobků:</b> ${item.quantity}

    <br>

    <b>Cena za kus:</b> ${item.unitPrice} Kč

</div>

<hr>

`;

});

document.getElementById(
    "items"
).innerHTML = itemsHtml;

document.getElementById(
    "payment"
).innerHTML = `

<b>Stav platby:</b>

${order.customer.paymentStatus ?? "-"}

<br><br>

<b>Způsob platby:</b>

Zatím není nastaven

`;

let historyHtml = "";

(order.history ?? []).forEach(item => {

    historyHtml += `

        <div style="margin-bottom:15px;">

            <b>${item.action}</b>

            <br>

            Stav:
            ${item.status}

            <br>

            Uživatel:
            ${item.user}

            <br>

            Datum:
            ${new Date(item.date).toLocaleString("cs-CZ")}

        </div>

        <hr>

    `;

});

document.getElementById(
    "history"
).innerHTML = historyHtml;

document.getElementById(
    "production"
).innerHTML = `

<b>Stav výroby:</b>

Čeká

<br><br>

<b>Poznámka:</b>

-

`;

document.getElementById(
    "shipping"
).innerHTML = `

<b>Doprava:</b>

${order.delivery}

<br><br>

<b>Stav:</b>

Neodesláno

`;

document.getElementById(
    "attachments"
).innerHTML = `

Žádné přílohy.

`;
}