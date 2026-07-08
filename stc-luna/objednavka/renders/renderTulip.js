import { formatPrice } from "../shared/formatPrice.js";
import { formatWeight } from "../shared/formatWeight.js";
import { formatPrintTime } from "../shared/formatPrintTime.js";

export function renderTulip(item, showProduction = false) {

    const flower = item.config.flower;
    const stem = item.config.stem;
    const leaf = item.config.leaf;

item.production ??= {};

item.production.flower ??= "Čeká";
item.production.stem ??= "Čeká";
item.production.leaf ??= "Čeká";

    return `

        <div class="cart-item">

            <h2>${item.productName}</h2>

            <hr>

            <div class="part-header">

${showProduction ? `
<h3>
    Květ

    Stav:

    <select
        class="part-status"
        data-uid="${item.uid}"
        data-part="flower">

<option
    value="Čeká"
    ${item.production.flower === "Čeká" ? "selected" : ""}>
    Čeká
</option>

<option
    value="Tisk"
    ${item.production.flower === "Tisk" ? "selected" : ""}>
    Tisk
</option>

<option
    value="Hotovo"
    ${item.production.flower === "Hotovo" ? "selected" : ""}>
    Hotovo
</option>

    </select>

</h3>
` : `
<h3>Květ</h3>
`}

</div>

            <p>
                <strong>Materiál:</strong>
                ${flower.material}
            </p>

            <p>
                <strong>Varianta:</strong>
                ${flower.variant}
            </p>

            <p>
                <strong>Barva:</strong>
                ${flower.color}
            </p>

            <hr>

${showProduction ? `            
<h3>
    Stonek

    Stav:

    <select
        class="part-status"
        data-uid="${item.uid}"
        data-part="stem">

<option
    value="Čeká"
    ${item.production.stem === "Čeká" ? "selected" : ""}>
    Čeká
</option>

<option
    value="Tisk"
    ${item.production.stem === "Tisk" ? "selected" : ""}>
    Tisk
</option>

<option
    value="Hotovo"
    ${item.production.stem === "Hotovo" ? "selected" : ""}>
    Hotovo
</option>

    </select>

</h3>
` : `
<h3>Stonek</h3>
`}


            <p>
                <strong>Materiál:</strong>
                ${stem.material}
            </p>

            <p>
                <strong>Varianta:</strong>
                ${stem.variant}
            </p>

            <p>
                <strong>Barva:</strong>
                ${stem.color}
            </p>

            <hr>
${showProduction ? `
<h3>
    List

    Stav:

    <select
        class="part-status"
        data-uid="${item.uid}"
        data-part="leaf">

<option
    value="Čeká"
    ${item.production.leaf === "Čeká" ? "selected" : ""}>
    Čeká
</option>

<option
    value="Tisk"
    ${item.production.leaf === "Tisk" ? "selected" : ""}>
    Tisk
</option>

<option
    value="Hotovo"
    ${item.production.leaf === "Hotovo" ? "selected" : ""}>
    Hotovo
</option>

    </select>

</h3>
` : `
<h3>List</h3>
`}



            <p>
                <strong>Počet:</strong>
                ${leaf.quantity}
            </p>

            <p>
                <strong>Materiál:</strong>
                ${leaf.material}
            </p>

            <p>
                <strong>Varianta:</strong>
                ${leaf.variant}
            </p>

            <p>
                <strong>Barva:</strong>
                ${leaf.color}
            </p>

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