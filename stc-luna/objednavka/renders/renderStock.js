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

            <p>
                <strong>Celkem:</strong>
                ${(item.unitPrice * item.quantity).toLocaleString("cs-CZ")} Kč
            </p>

        </div>

    `;

}