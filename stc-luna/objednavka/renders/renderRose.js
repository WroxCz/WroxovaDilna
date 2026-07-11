import { formatPrice } from "../shared/formatPrice.js";
import { formatWeight } from "../shared/formatWeight.js";
import { formatPrintTime } from "../shared/formatPrintTime.js";

export function renderRose(item, showProduction = false) {

    const sizeNames = {
        s: "5 cm",
        m: "7 cm",
        l: "10 cm"
    };

item.production ??= {};

if (item.production.rose === true) {

    item.production.rose = "Hotovo";

}

else if (item.production.rose === false) {

    item.production.rose = "Čeká";

}

item.production.rose ??= "Čeká";

let itemStatus =
    item.production.rose;

    return `

        <div class="cart-item">

<div class="item-title">

    <h2>${item.productName}</h2>

    ${showProduction ? `

        <select
            class="item-status"
            data-uid="${item.uid}"
            disabled>

            <option
                value="Čeká"
                ${itemStatus === "Čeká" ? "selected" : ""}>
                Čeká
            </option>

            <option
                value="Ve výrobě"
                ${itemStatus === "Ve výrobě" ? "selected" : ""}>
                Ve výrobě
            </option>

            <option
                value="Hotovo"
                ${itemStatus === "Hotovo" ? "selected" : ""}>
                Hotovo
            </option>

        </select>

    ` : ""}

</div>

            <p>
                <strong>Velikost:</strong>
                ${sizeNames[item.config.size] ?? item.config.size}
            </p>

            <p>
                <strong>Dno:</strong>
                ${item.config.bottom ? "Ano" : "Ne"}
            </p>

            <p>
                <strong>Materiál:</strong>
                ${item.config.material}
            </p>

            <p>
                <strong>Varianta:</strong>
                ${item.config.variant}
            </p>

            <p>
                <strong>Barva:</strong>
                ${item.config.color}
            </p>
            
${showProduction ? `
<h3>

    Růže

    Stav:

    <select
        class="part-status"
        data-uid="${item.uid}"
        data-part="rose">

        <option
            value="Čeká"
            ${item.production.rose === "Čeká" ? "selected" : ""}>
            Čeká
        </option>

        <option
            value="Ve výrobě"
            ${item.production.rose === "Ve výrobě" ? "selected" : ""}>
            Ve výrobě
        </option>

        <option
            value="Hotovo"
            ${item.production.rose === "Hotovo" ? "selected" : ""}>
            Hotovo
        </option>

    </select>

</h3>
` : `
<h3>Růže</h3>
`}
            <hr>

<p>
    <strong>Hmotnost:</strong>
    ${formatWeight(item.unitWeight * item.quantity)}
</p>

<p>
    <strong>Doba tisku:</strong>
    ${formatPrintTime(item.unitPrintTime * item.quantity)}
</p>

<p>
    <strong>Cena:</strong>
    ${formatPrice(item.unitPrice * item.quantity)}
</p>
<hr>

<div class="quantity-controls">

    <button
        class="qty-minus"
        data-uid="${item.uid}">
        −
    </button>

    <strong>${item.quantity} ks</strong>

    <button
        class="qty-plus"
        data-uid="${item.uid}">
        +
    </button>

</div>
<hr>

<button
    class="remove-item"
    data-uid="${item.uid}">
    🗑 Odebrat z košíku
</button>

        </div>

    `;

}