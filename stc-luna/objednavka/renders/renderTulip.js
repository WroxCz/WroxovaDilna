import { formatPrice } from "../shared/formatPrice.js";
import { formatWeight } from "../shared/formatWeight.js";
import { formatPrintTime } from "../shared/formatPrintTime.js";

export function renderTulip(item) {

    const flower = item.config.flower;
    const stem = item.config.stem;
    const leaf = item.config.leaf;

    return `

        <div class="cart-item">

            <h2>${item.productName}</h2>

            <hr>

            <div class="part-header">

    <h3>Květ</h3>

    <label>

        <input
            type="checkbox"
            class="production-part"
            data-uid="${item.uid}"
            data-part="flower">

        Hotovo

    </label>

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

            <h3>Stonek</h3>

<label>

    <input
        type="checkbox"
        class="production-part"
        data-uid="${item.uid}"
        data-part="stem">

    Hotovo

</label>

<br><br>

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

            <h3>List</h3>

<label>

    <input
        type="checkbox"
        class="production-part"
        data-uid="${item.uid}"
        data-part="leaf">

    Hotovo

</label>

<br><br>            

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