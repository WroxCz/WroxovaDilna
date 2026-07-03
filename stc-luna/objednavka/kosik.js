import { storage } from "../../firebase/firebase.js";

import { ref, deleteObject } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";


let cart = JSON.parse(
    localStorage.getItem("lm-cart")
) || [];

let cartTotal = 0;

const labels = {
    flower: "Květ",
    stem: "Stonek",
    leaf: "List"
};

const container =
    document.getElementById(
        "cart-items"
    );

    function formatTime(minutes){

    const hours =
        Math.floor(
            minutes / 60
        );

    const mins =
        minutes % 60;

    return `${hours} h ${mins} min`;

}

cart.forEach(item => {
    cartTotal +=
        item.unitPrice
        *
        item.quantity;

    container.innerHTML += `

    <div class="cart-item">

        <h2>
            ${item.productName}
        </h2>
${item.type === "stock" ? `

    <div class="stock-badge">

        📦 Skladem

        ${item.stockCode}

        -

        ${item.stockName}

    </div>

` : item.type === "helenka" ? `

    <div class="print-badge">

        🖼️ Projekt Helenka

    </div>

` : `

    <div class="print-badge">

        🖨️ Zakázkový tisk

    </div>

`}



    <p>
<button
    onclick="decreaseQuantity('${item.uid}')">

    -

</button>

<button
    onclick="increaseQuantity('${item.uid}')">

    +

</button>
Kusů:
${item.quantity}
</p>
</p>


${item.type === "stock" ? `

<div class="stock-info">

    Varianta:

    ${item.stockCode}

    -

    ${item.stockName}

</div>

` : item.type === "helenka" ? `

<div class="helenka-config">

    <h3>Litofánové destičky</h3>

    ${item.plates.length === 0
        ? "<p>Žádné</p>"
        : item.plates.map((plate, index) => `

            <div class="helenka-plate">

                <strong>Destička ${index + 1}</strong>

                <p>📷 ${plate.originalFileName}</p>

<p>
    <strong>Storage soubor:</strong><br>
    ${plate.storageFileName ?? "-"}
</p>

<p>
    <strong>Storage cesta:</strong><br>
    ${plate.storagePath ?? "-"}
</p>

<p>
    <strong>Image URL:</strong><br>
    ${plate.imageUrl ?? "-"}
</p>

<p>Orientace:
    ${plate.orientation === "portrait"
        ? "Na výšku"
        : "Na šířku"}
</p>

                <p>Cena:
                    ${plate.price.total} Kč
                </p>

            </div>

        `).join("")
    }

    <h3>Rámečky</h3>

    ${item.frames.length === 0
        ? "<p>Žádné</p>"
        : item.frames.map((frame, index) => `

            <div class="helenka-frame">

                <strong>Rámeček ${index + 1}</strong>

                <p>
                    Materiál:
                    ${frame.filament?.name ?? "-"}
                </p>

                <p>
                    LED:
                    ${frame.ledPanel?.name ?? "Bez LED"}
                </p>

                <p>
                    Adaptér:
                    ${frame.adapter?.name ?? "Bez adaptéru"}
                </p>

                <p>
                    Cena:
                    ${frame.price.total} Kč
                </p>

            </div>

        `).join("")
    }

</div>

` : `

<div>

${Object.entries(item.config)
.map(([partName, part]) => `

    <h3>

        ${labels[partName] || partName}

    </h3>

    <p>

        ${part.quantity ?? 1} ks

    </p>

    <p>

        ${part.material ?? "-"}

        ${part.variant ?? ""}

    </p>

    <p>

        ${part.color ?? "-"}

    </p>

`)
.join("")}

</div>

`}

        <p>
    Cena za kus:
    ${item.unitPrice} Kč
</p>

<p>
    Mezisoučet:
    ${item.unitPrice * item.quantity} Kč
</p>

        ${item.type !== "stock" ? `

<p>
    Hmotnost:
    ${(item.unitWeight * item.quantity).toFixed(2)} g
</p>

<p>
    Doba tisku:
    ${formatTime(item.unitPrintTime * item.quantity)}
</p>

` : `

<p>

    📦 Produkt je skladem

</p>

`}

<button
    onclick="removeItem('${item.uid}')">

    Smazat

</button>

        <hr>

    </div>

`;

});

document.getElementById(
    "cart-total"
).textContent =
    cartTotal + " Kč";

console.log(cart);
console.log(container.innerHTML);
console.log("unitPrintTime:", cart[0]?.unitPrintTime);

async function removeItem(uid){

    const item =
        cart.find(item =>
            item.uid === uid
        );

    if(item?.plates){

        for(const plate of item.plates){

            if(!plate.storagePath){
                continue;
            }

            try{

                await deleteObject(
                    ref(
                        storage,
                        plate.storagePath
                    )
                );

                console.log(
                    "Smazána fotografie:",
                    plate.storagePath
                );

            }

            catch(error){

                console.warn(
                    "Mazání fotografie selhalo:",
                    plate.storagePath,
                    error
                );

            }

        }

    }

    cart = cart.filter(item =>
        item.uid !== uid
    );

    localStorage.setItem(
        "lm-cart",
        JSON.stringify(cart)
    );

    location.reload();

}
function increaseQuantity(uid){

    const item =
        cart.find(item =>
            item.uid === uid
        );

    if(item){

        item.quantity++;

    }

    localStorage.setItem(
        "lm-cart",
        JSON.stringify(cart)
    );

    location.reload();

}
function decreaseQuantity(uid){

    const item =
        cart.find(item =>
            item.uid === uid
        );

    if(item && item.quantity > 1){

        item.quantity--;

    }

    localStorage.setItem(
        "lm-cart",
        JSON.stringify(cart)
    );

    location.reload();

}
function goToOrder(){

    if(cart.length === 0){

        alert(
            "Košík je prázdný."
        );

        return;

    }

    window.location.href =
        "objednavka.html";

}

window.removeItem = removeItem;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.goToOrder = goToOrder;