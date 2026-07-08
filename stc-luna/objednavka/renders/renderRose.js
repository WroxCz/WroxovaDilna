import { formatPrice } from "../shared/formatPrice.js";
import { formatWeight } from "../shared/formatWeight.js";
import { formatPrintTime } from "../shared/formatPrintTime.js";

export function renderRose(item) {

    const sizeNames = {
        s: "5 cm",
        m: "7 cm",
        l: "10 cm"
    };

item.production ??= {};

item.production.rose ??= false;

    return `

        <div class="cart-item">

            <h2>${item.productName}</h2>

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
<h3>
    Růže
    <input
        type="checkbox"
        class="production-part"
        data-uid="${item.uid}"
        data-part="rose"
        ${item.production?.rose ? "checked" : ""}>
    Hotovo
</h3>
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