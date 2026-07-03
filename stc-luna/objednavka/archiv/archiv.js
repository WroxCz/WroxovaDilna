import { 
    db,
     auth
    }
from "../../../firebase/firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy,
    deleteDoc,
    doc,
    updateDoc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const container =
document.getElementById(
    "orders-container"
);

let isAdmin = false;

onAuthStateChanged(auth, (user) => {

    isAdmin = !!user;

    loadOrders();

});

async function loadOrders(){

    try{

        const snapshot =
        await getDocs(

            query(
                collection(
                    db,
                    "orders"
                ),
                orderBy(
                    "created",
                    "desc"
                )
            )

        );

        let html = "";

        snapshot.forEach(doc => {

            const order =
            doc.data();

let createdText = "-";

if(order.created?.toDate){

    createdText =
    order.created
        .toDate()
        .toLocaleString("cs-CZ");

}


            const itemsHtml =
(order.items || [])
.map(item => {

    let configHtml = "";

    if(item.config){

        Object.entries(item.config)
        .forEach(([sectionName, sectionData]) => {

            configHtml += `

                <div class="config-section">

                    <h4>${sectionName}</h4>

            `;

            Object.entries(sectionData)
            .forEach(([key, value]) => {

                configHtml += `
                    <p>
                        <strong>${key}:</strong>
                        ${value}
                    </p>
                `;

            });

            configHtml += `
                </div>
            `;

        });

    }
let helenkaHtml = "";

if (item.type === "helenka") {

    helenkaHtml = `

        <h4>Litofánové destičky</h4>

        ${(item.plates || []).map((plate, index) => `

            <div class="helenka-plate">

                <strong>Destička ${index + 1}</strong>

                <p>
                    📷 ${plate.originalFileName}
                </p>

                <p>
                    Orientace:
                    ${plate.orientation === "portrait"
                        ? "Na výšku"
                        : "Na šířku"}
                </p>

                <p>
                    Režim:
                    ${plate.mode === "lit"
                        ? "Litofán"
                        : "Bez podsvícení"}
                </p>

                <p>
                    Cena:
                    ${plate.price.total} Kč
                </p>

            </div>

        `).join("")}

    `;

}
    return `

        <div class="item-card">

            <h3>
                ${item.stockName || item.productName}
            </h3>

            <p>
                <strong>Kód:</strong>
                ${item.stockCode || "-"}
            </p>

            <p>
                <strong>Kusů:</strong>
                ${item.quantity}
            </p>

            <p>
                <strong>Cena za kus:</strong>
                ${item.unitPrice} Kč
            </p>

            ${configHtml}
            
            ${helenkaHtml}

        </div>

    `;

})
.join("");

html += `

<div class="order-card">

    <h2>
        ${order.customer?.name || "Neznámý zákazník"}
    </h2>
<p>
    <strong>ID:</strong>
    ${order.id || "-"}
</p>

<p>
    <strong>Datum:</strong>
    ${createdText}
</p>
    <p>
        <strong>E-mail:</strong>
        ${order.customer?.email || "-"}
    </p>

    <p>
        <strong>Telefon:</strong>
        ${order.customer?.phone || "-"}
    </p>

    <p>
        <strong>Adresa:</strong>
        ${order.customer?.street || "-"},
        ${order.customer?.city || "-"},
        ${order.customer?.zip || "-"}
    </p>

    <p>
        <strong>Doprava:</strong>
        ${order.delivery || "-"}
    </p>

    <p>
        <strong>Cena:</strong>
        ${order.totalPrice || 0} Kč
    </p>

${isAdmin ? `

<div class="admin-status">

    <select
        class="status-select"
        data-id="${doc.id}">

        <option ${order.status==="NOVÁ"?"selected":""}>
            NOVÁ
        </option>

        <option ${order.status==="PŘIJATO"?"selected":""}>
            PŘIJATO
        </option>

        <option ${order.status==="ČEKÁ NA VÝROBU"?"selected":""}>
            ČEKÁ NA VÝROBU
        </option>

        <option ${order.status==="VE VÝROBĚ"?"selected":""}>
            VE VÝROBĚ
        </option>

        <option ${order.status==="HOTOVO"?"selected":""}>
            HOTOVO
        </option>

        <option ${order.status==="ODESLÁNO"?"selected":""}>
            ODESLÁNO
        </option>

        <option ${order.status==="DOKONČENO"?"selected":""}>
            DOKONČENO
        </option>

        <option ${order.status==="STORNO"?"selected":""}>
            STORNO
        </option>

    </select>

</div>

` : `

<p>
    <strong>Stav:</strong>
    ${order.status || "-"}
</p>

`}
${isAdmin ? `

<div class="admin-payment">

    <select
        class="payment-select"
        data-id="${doc.id}">

        <option ${order.paymentStatus==="NEZAPLACENO"?"selected":""}>
            NEZAPLACENO
        </option>

        <option ${order.paymentStatus==="ZAPLACENO"?"selected":""}>
            ZAPLACENO
        </option>

        <option ${order.paymentStatus==="VRÁCENO"?"selected":""}>
            VRÁCENO
        </option>

    </select>

</div>

` : `

<p>
    <strong>Platba:</strong>
    ${order.paymentStatus || "NEZAPLACENO"}
</p>

`}
    <h3>Položky objednávky</h3>

    <ul>
        ${itemsHtml}
    </ul>

${isAdmin ? `

<button
    class="delete-button"
    data-id="${doc.id}">
    Smazat
</button>

<button
    class="save-button"
    data-id="${doc.id}">
    Uložit
</button>

` : ""}


</div>

<hr>

`;

        });

        container.innerHTML = html;
if(isAdmin){

    document
    .querySelectorAll(
        ".delete-button"
    )    
    .forEach(button => {

        button.addEventListener(
            "click",
            async () => {

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
                            button.dataset.id
                        )
                    );

                    loadOrders();

                }

                catch(error){

                    console.error(error);

                    alert(
                        "Mazání selhalo."
                    );

                }

            }
        );

    });
document
.querySelectorAll(
    ".save-button"
)
.forEach(button => {

    button.addEventListener(
        "click",
        async () => {

            try{

                const orderId =
                button.dataset.id;

                const card =
                button.closest(
                    ".order-card"
                );

                const status =
                card.querySelector(
                    ".status-select"
                ).value;

                const paymentStatus =
                card.querySelector(
                    ".payment-select"
                ).value;

                await updateDoc(
                    doc(
                        db,
                        "orders",
                        orderId
                    ),
                    {
                        status,
                        paymentStatus
                    }
                );

                alert(
                    "Stavy uloženy."
                );

            }

            catch(error){

                console.error(error);

                alert(
                    "Uložení selhalo."
                );

            }

        }
    );

});
}
    }

    catch(error){

        console.error(error);

        container.innerHTML =
            "Chyba při načítání objednávek.";

    }

}

loadOrders();