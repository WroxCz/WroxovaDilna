export function renderStock(item) {

    return `

        <div class="cart-item">

            <h2>${item.stockName}</h2>

            <p>
                <strong>Kód skladu:</strong>
                ${item.stockCode}
            </p>

            <p>
                <strong>Množství:</strong>
                ${item.quantity} ks
            </p>

            <hr>

            <p>
                <strong>Cena za kus:</strong>
                ${item.unitPrice} Kč
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

            <p>
                <strong>Celkem:</strong>
                ${(item.unitPrice * item.quantity).toLocaleString("cs-CZ")} Kč
            </p>

        </div>

    `;

}