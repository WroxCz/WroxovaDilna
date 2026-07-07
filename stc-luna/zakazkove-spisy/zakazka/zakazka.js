import { db }
from "../../../firebase/firebase.js";

import {
    checkAccess
}
from "../../../firebase/authGuard.js";

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

checkAccess((userData) => {

    applyRolePermissions(userData.role);

    loadOrder();

});
function renderTulipan(item) {

    return `

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

}
function renderHelenka(item) {

    let html = `

<div style="margin-bottom:25px;">

<h3>${item.productName}</h3>

`;

    // ==========================
    // Litofánové destičky
    // ==========================

    if (item.plates?.length) {

        html += `<h4>📷 Litofánové destičky</h4>`;

        item.plates.forEach((plate, index) => {

            html += `

<b>Destička ${index + 1}</b><br>

Fotografie:
${plate.originalFileName}<br>

Storage soubor:
${plate.storageFileName ?? "-"}<br>

Orientace:
${plate.orientation}<br>

Cena:
${plate.price.total} Kč

<br><br>

`;

        });

    }

    // ==========================
    // Rámečky
    // ==========================

    if (item.frames?.length) {

        html += `<h4>🖼️ Rámečky</h4>`;

        item.frames.forEach((frame, index) => {

            html += `

<b>Rámeček ${index + 1}</b><br>

Materiál:
${frame.filament?.material ?? "-"}<br>

Barva:
${frame.filament?.name ?? "-"}<br>

LED:
${frame.ledPanel?.name ?? "Bez LED"}<br>

Adaptér:
${frame.adapter?.name ?? "Bez adaptéru"}<br>

Cena:
${frame.price.total} Kč

<br><br>

`;

        });

    }

    html += `

</div>

<hr>

`;

    return html;

}
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

order.items.forEach((item, index) => {

    if (item.type === "helenka") {

        itemsHtml += renderHelenka(item);

    } else {

        itemsHtml += renderTulipan(item);

    }

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



let productionHtml = "";

order.items.forEach(item => {

    productionHtml += `

<div style="margin-bottom:15px; display:flex; align-items:center; gap:12px;">

<select class="production-status" data-index="${index}">

    <option
        value="Čeká"
        ${item.productionStatus === "Čeká" ? "selected" : ""}>
        Čeká
    </option>

    <option
        value="Tisk"
        ${item.productionStatus === "Tisk" ? "selected" : ""}>
        Tisk
    </option>

    <option
        value="Hotovo"
        ${item.productionStatus === "Hotovo" ? "selected" : ""}>
        Hotovo
    </option>

</select>

    <b>${item.productName}</b>

</div>

`;

});

document.getElementById(
    "production"
).innerHTML = productionHtml;



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
document
.querySelectorAll(".section-title")
.forEach(title => {

    title.addEventListener(
        "click",
        () => {

            title.parentElement
            .classList.toggle("open");

        }
    );

});
function applyRolePermissions(role){

    document
        .querySelectorAll(".section")
        .forEach(section => {

            const roles =
                section.dataset.roles
                    .split(",");

            if(!roles.includes(role)){

                section.style.display =
                    "none";

            }

        });

}