import { db }
from "../../firebase/firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    getDoc,
    updateDoc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// tesetststs
async function generateOrderNumber(){

    const counterRef =
        doc(db, "system", "orderCounter");

    const snapshot =
        await getDoc(counterRef);

    const data =
        snapshot.data();

    const today =
        new Date();

    const day =
        String(today.getDate()).padStart(2, "0");

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const year =
        String(today.getFullYear()).slice(-2);

    const todayString =
        `${day}${month}${year}`;

    let current = 1;

    if(data.lastDate === todayString){

        current = data.current + 1;

    }

    await updateDoc(counterRef, {

        lastDate: todayString,

        current: current

    });

    return `LM-${todayString}-${String(current).padStart(2,"0")}`;

}

let cart =
JSON.parse(
    localStorage.getItem("lm-cart")
) || [];

if(cart.length === 0){

    window.location.href =
        "kosik.html";

}
let totalPrice = 0;
let deliveryPrice = 0;

const container =
document.getElementById(
    "order-items"
);

cart.forEach(item => {

    const subtotal =
        item.unitPrice *
        item.quantity;

    totalPrice += subtotal;

    container.innerHTML += `

        <div class="order-item">

            <h3>
                ${item.productName}
            </h3>

            <p>
                Kusů:
                ${item.quantity}
            </p>

            <p>
                Cena:
                ${subtotal} Kč
            </p>

        </div>

        <hr>

    `;

});

document.getElementById(
    "order-subtotal"
).textContent =
    `Zboží: ${totalPrice} Kč`;

document.getElementById(
    "delivery-price"
).textContent =
    `Doprava: ${deliveryPrice} Kč`;

document.getElementById(
    "order-total"
).textContent =
    `Celkem: ${totalPrice + deliveryPrice} Kč`;

async function submitOrder(){

const name =
document.getElementById(
    "customer-name"
).value.trim();

const email =
document.getElementById(
    "customer-email"
).value.trim();

const phone =
document.getElementById(
    "customer-phone"
).value.trim();

const delivery =
document.getElementById(
    "delivery"
).value;

if(!name){

    alert("Vyplňte jméno.");

    return;

}

if(!email){

    alert("Vyplňte e-mail.");

    return;

}

if(!phone){

    alert("Vyplňte telefon.");

    return;

}

if(!delivery){

    alert("Vyberte dopravu.");

    return;

}
if(
    !document.getElementById(
        "terms"
    ).checked
){

    alert(
        "Musíte souhlasit s obchodními podmínkami."
    );

    return;

}

const orderNumber =
    await generateOrderNumber();

const orderNumber =
    await generateOrderNumber();

const orderItems = cart.map(item => ({

    ...item,

    productionStatus: "Čeká"

}));

    const order = {

        orderNumber: null,

        customer: {

            name:
                document.getElementById(
                    "customer-name"
                ).value,

            email:
                document.getElementById(
                    "customer-email"
                ).value,

            phone:
                document.getElementById(
                    "customer-phone"
                ).value,

            street:
                document.getElementById(
                    "customer-street"
                ).value,

            city:
                document.getElementById(
                    "customer-city"
                ).value,

            zip:
                document.getElementById(
                    "customer-zip"
                ).value,

                status: "NOVÁ",
                paymentStatus: "NEZAPLACENO",
        },

        delivery:
            document.getElementById(
                "delivery"
            ).value,

        note:
            document.getElementById(
                "customer-note"
            ).value,


            
        items: orderItems,

        subtotalPrice:
    totalPrice,

deliveryPrice,

totalPrice:
    totalPrice + deliveryPrice,
history: [
    {
        date: new Date().toISOString(),
        action: "Zakázka vytvořena",
        status: "Přijato",
        user: "Systém"
    }
]
    };

    try{

    await addDoc(
    collection(
        db,
        "orders"
    ),
    {
        ...order,

        orderNumber,

        status: "Přijato",

        created:
        serverTimestamp(),

        updated:
        serverTimestamp()
    }
);

    localStorage.setItem(
        "lm-last-order",
        JSON.stringify(order)
    );

    localStorage.removeItem(
        "lm-cart"
    );

    window.location.href =
        "dekujeme.html";

}

catch(error){

    console.error(error);

    alert(
        "Objednávku se nepodařilo uložit."
    );

}

}
function updateDelivery(){

    const delivery =
        document.getElementById(
            "delivery"
        ).value;

    deliveryPrice = 0;

    if(delivery === "Balíkovna"){

        deliveryPrice = 99;

    }

    if(delivery === "Zásilkovna"){

        deliveryPrice = 99;

    }
    if(delivery === "PPL"){
    deliveryPrice = 99;
    }

    document.getElementById(
        "delivery-price"
    ).textContent =
        `Doprava: ${deliveryPrice} Kč`;

    document.getElementById(
        "order-total"
    ).textContent =
        `Celkem: ${totalPrice + deliveryPrice} Kč`;

}
window.submitOrder = submitOrder;
window.updateDelivery = updateDelivery;