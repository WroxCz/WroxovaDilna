export function renderUnknown(item) {

    return `

        <div class="cart-item">

            <h2>${item.productName}</h2>

            <p>
                Tento typ produktu zatím nemá renderer.
            </p>

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

            <p>
                ${Number(
                    item.totalPrice ??
                    (item.unitPrice * item.quantity)
                ).toLocaleString("cs-CZ")} Kč
            </p>
<hr>

<button
    class="remove-item"
    data-uid="${item.uid}">
    🗑 Odebrat z košíku
</button>
        </div>

    `;

}