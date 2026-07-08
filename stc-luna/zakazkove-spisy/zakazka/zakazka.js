import { db }
from "../../../firebase/firebase.js";

import {
    checkAccess
}
from "../../../firebase/authGuard.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    renderUnknown,
    renderStock,
    renderRose,
    renderHelenka,
    renderTulip
} from "../../objednavka/renders/index.js";


function getPaymentMethodName(method){

    switch(method){

        case "bankovni-prevod":
            return "Bankovní převod";

        case "dobirka":
            return "Dobírka";

        case "hotove":
            return "Hotově při osobním převzetí";

        default:
            return "-";

    }

}

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

let needsSave = false;

order.items.forEach(item => {

    if (!item.production) {

        item.production = {};
        needsSave = true;

    }

});

if (needsSave) {

    await updateDoc(orderRef, {

        items: order.items

    });

}

    document.getElementById(
        "order-number"
    ).textContent =
        order.orderNumber;

const overviewStatus =
    document.getElementById(
        "overview-status"
    );

updateOverviewStatus(order.status);       
     
    document.getElementById(
    "overview"
).innerHTML = `


<b>Číslo zakázky:</b>
${order.orderNumber}

<br><br>

<b>Vytvořeno:</b>
${order.created?.toDate().toLocaleString("cs-CZ") ?? "-"}

<br><br>

<b>Stav:</b>

<select id="order-status" class="production-status">

    <option
        value="Přijato"
        ${order.status === "Přijato" ? "selected" : ""}>
        Přijato
    </option>

    <option
        value="Potvrzeno"
        ${order.status === "Potvrzeno" ? "selected" : ""}>
        Potvrzeno
    </option>

    <option
        value="Dokončeno"
        ${order.status === "Dokončeno" ? "selected" : ""}>
        Dokončeno
    </option>

</select>

`;        
const orderStatus =
    document.getElementById("order-status");

updateProductionColor(orderStatus);

orderStatus.addEventListener("change", async () => {

    updateProductionColor(orderStatus);

    updateOverviewStatus(orderStatus.value);

    try{

        await updateDoc(orderRef, {

            status: orderStatus.value

        });

    }

    catch(error){

        console.error(error);

        alert("Nepodařilo se uložit stav zakázky.");

    }

});


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

switch (item.productId) {

    case "stock":
        itemsHtml += renderStock(item);
        break;

    case "tulip-with-stem":
        itemsHtml += renderTulip(item);
        break;

    case "rose-spiral-vase":
        itemsHtml += renderRose(item);
        break;

    case "projekt-helenka":
        itemsHtml += renderHelenka(item);
        break;

    default:
        itemsHtml += renderUnknown(item);
}

});

document.getElementById("items").innerHTML = itemsHtml;

document
    .querySelectorAll(".production-part")
    .forEach(checkbox => {

        checkbox.addEventListener("change", async () => {

            const uid =
                checkbox.dataset.uid;

            const part =
                checkbox.dataset.part;

            const item =
                order.items.find(
                    item => item.uid === uid
                );

            if (!item) return;

            item.production[part] =
                checkbox.checked;

            try{

                await updateDoc(orderRef, {

                    items: order.items

                });

            }

            catch(error){

                console.error(error);

                alert("Nepodařilo se uložit stav výroby.");

            }

        });

    });

document.getElementById(
    "payment"
).innerHTML = `

<b>Stav platby:</b>

<select id="payment-status">

    <option
        value="NEZAPLACENO"
        ${order.customer.paymentStatus === "NEZAPLACENO" ? "selected" : ""}>
        Nezaplaceno
    </option>

    <option
        value="ZAPLACENO"
        ${order.customer.paymentStatus === "ZAPLACENO" ? "selected" : ""}>
        Zaplaceno
    </option>

    <option
        value="VRACENA_PLATBA"
        ${order.customer.paymentStatus === "VRACENA_PLATBA" ? "selected" : ""}>
        Vrácena platba
    </option>

</select>

<br><br>

<b>Způsob platby:</b>

${getPaymentMethodName(order.paymentMethod)}

<br><br>

<button id="send-payment-request">

    Odeslat výzvu k platbě

</button>
`;

function updatePaymentStatus(status){

    const badge =
        document.getElementById(
            "payment-status-badge"
        );

    badge.className = "status-badge";

    switch(status){

        case "NEZAPLACENO":

            badge.textContent = "Nezaplaceno";
            badge.classList.add("status-waiting");
            break;

        case "ZAPLACENO":

            badge.textContent = "Zaplaceno";
            badge.classList.add("status-finished");
            break;

        case "VRACENA_PLATBA":

            badge.textContent = "Vrácena platba";
            badge.classList.add("returned");
            break;

    }

}

const paymentStatus =
    document.getElementById(
        "payment-status"
    );

updatePaymentStatus(
    order.customer.paymentStatus
);    

paymentStatus.addEventListener("change", async () => {

    updatePaymentStatus(
    paymentStatus.value
);

    try{

        await updateDoc(orderRef, {

            "customer.paymentStatus":
                paymentStatus.value

        });

    }

    catch(error){

        console.error(error);

        alert("Nepodařilo se uložit stav platby.");

    }

});

const sendPaymentRequest =
    document.getElementById(
        "send-payment-request"
    );

sendPaymentRequest.addEventListener("click", () => {

    window.location.href =
    `../platby/platba.html?id=${id}`;

});

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

updateShippingStatus(
    "NEODESLANO"
);

document.getElementById(
    "shipping"
).innerHTML = `

<b>Doprava:</b>

${order.delivery}

<br><br>

<b>Stav:</b>

<select id="shipping-status">

    <option value="NEODESLANO">
        Neodesláno
    </option>

    <option value="ODESLANO">
        Odesláno
    </option>

</select>

`;

const shippingStatus =
    document.getElementById(
        "shipping-status"
    );

updateShippingStatus(
    shippingStatus.value
);

shippingStatus.addEventListener("change", () => {

    updateShippingStatus(
        shippingStatus.value
    );

});

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

function updateOverviewStatus(status){

    const badge =
        document.getElementById(
            "overview-status"
        );

    badge.textContent = status;

    badge.className = "status-badge";

    switch(status){

        case "Přijato":
            badge.classList.add("status-waiting");
            break;

        case "Potvrzeno":
            badge.classList.add("status-printing");
            break;

        case "Dokončeno":
            badge.classList.add("status-finished");
            break;

    }

}

function updateProductionColor(select){

    const element = select;

element.classList.remove(
    "waiting",
    "printing",
    "finished",
    "returned"
);

switch(select.value){

    case "Čeká":
    case "Přijato":
    case "NEZAPLACENO":
        element.classList.add("waiting");
        break;

    case "Tisk":
    case "Potvrzeno":
        element.classList.add("printing");
        break;

    case "Hotovo":
    case "Dokončeno":
    case "ZAPLACENO":
        element.classList.add("finished");
        break;

    case "VRACENA_PLATBA":
        element.classList.add("returned");
        break;

}

}

function updateShippingStatus(status){

    const badge =
        document.getElementById(
            "shipping-status-badge"
        );

    badge.className = "status-badge";

    switch(status){

        case "NEODESLANO":

            badge.textContent = "Neodesláno";
            badge.classList.add("status-waiting");
            break;

        case "ODESLANO":

            badge.textContent = "Odesláno";
            badge.classList.add("status-finished");
            break;

    }

}

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