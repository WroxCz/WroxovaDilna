import { db, auth }
from "../../firebase/firebase.js";

import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

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

// loadOrders();

document
.querySelector("#status-filter")
.addEventListener(
    "change",
    function(){

        loadOrders();

    }
);

let isAdmin = false;

onAuthStateChanged(auth, (user) => {

    isAdmin = !!user;

    loadOrders();

});

document
.querySelector("#id-filter")
.addEventListener(
    "input",
    loadOrders
);

async function loadOrders(){

    try{

        const q = query(
    collection(db, "orders"),
    orderBy("created", "desc")
);

const snapshot =
await getDocs(q);

        let html = "";

        const selectedStatus =
        document.querySelector(
            "#status-filter"
        )?.value || "all";

const searchText =
document.querySelector(
    "#id-filter"
)?.value
?.toLowerCase()
?.trim() || "";

        snapshot.forEach(doc => {

    const order =
    doc.data();

    if(
        selectedStatus !== "all" &&
        order.status !== selectedStatus
    ){
        return;
    }

    const id =
    doc.id;

    if(searchText){

        const searchableText = `
            ${id}
            ${order.customerName || ""}
            ${order.model || ""}
            ${order.email || ""}
        `.toLowerCase();

        if(
            !searchableText.includes(searchText)
        ){
            return;
        }
    }

    let created = "-";

if(order.created){

const dateObj =
order.created.toDate();

const datePart =
dateObj.toLocaleDateString("cs-CZ");

const timePart =
dateObj.toLocaleTimeString("cs-CZ");

created = `
${datePart}
<br>
${timePart}
`;

}

let statusClass = "status-nova";

switch(order.status){

    case "Potvrzená":
        statusClass = "status-potvrzena";
        break;

    case "Ve výrobě":
        statusClass = "status-vyroba";
        break;

    case "Hotovo":
        statusClass = "status-hotovo";
        break;
}

let paymentClass = "payment-unpaid";

switch(order.paymentStatus){

    case "Zaplaceno":
        paymentClass = "payment-paid";
        break;
}

html += `

<div
    class="order-card collapsed"
    data-id="${id}">

    <svg class="oct-border"
         viewBox="0 0 100 100"
         preserveAspectRatio="none">

        <polygon points="
4,0
96,0
100,6
100,94
96,100
4,100
0,94
0,6
"/>

    </svg>

    <div class="order-header">

    <span class="order-id">
    #LM-${order.orderNumber || "????"}
</span>

    <span class="order-date">
    ${created}
</span>

</div>

<div class="order-content">

    <div class="order-left">

    ${order.modelPath ? `
<div class="order-image">
    <img
        src="../modely/${order.modelPath}/preview/preview1.webp"
        alt="${order.model}">
</div>

<div class="order-status ${statusClass}">
    ${(order.status || "Nová").toUpperCase()}
</div>

` : ""}

    </div>

    <div class="order-right">

    <div class="order-model">
        ${order.model || "Neznámý model"}
    </div>

    

    <div class="order-quantity">
    Počet: ${order.quantity || 1} ks
</div>

<div class="order-material">
    Materiál: ${order.material || "-"}
</div>

<div class="order-customer">
     ${order.customerName || "-"}
</div>

</div>

</div>

<div class="order-details">
<div class="order-section">

    <div class="two-columns">

        <div>

            <div class="order-section-title">
                Zákazník
            </div>

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
<div class="order-price">
        ${order.price || 0}
        <span class="price-currency">Kč</span>
    </div>

    <div class="order-payment">

        <span class="badge ${paymentClass}">
            ${order.paymentStatus}
        </span>

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

${isAdmin ? `

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

` : ""}
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

                    <div class="note-row">

    <textarea
        class="edit-note"
        rows="4">${currentNote}</textarea>

    <button
        class="delete-button">
        Smazat
    </button>

</div>

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

        if(!isAdmin){

    alert(
        "Pro úpravu objednávek musíte být přihlášeni."
    );

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

        if(!isAdmin){

    alert(
        "Pro mazání objednávek musíte být přihlášeni."
    );

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
document.addEventListener(
    "click",
    function(e){

        const card =
        e.target.closest(".order-card");

        if(!card){
            return;
        }

        if(
    e.target.classList.contains("edit-button") ||
    e.target.classList.contains("save-button") ||
    e.target.classList.contains("delete-button") ||
    e.target.closest(".edit-form")
){
    return;
}
        card.classList.toggle("collapsed");

    }
);