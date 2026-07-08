export function renderUnknown(item) {

    return `

        <div class="cart-item">

            <h2>${item.productName}</h2>

            <p>
                Tento typ produktu zatím nemá renderer.
            </p>

            <p>
                Množství: ${item.quantity}
            </p>

            <p>
                ${Number(
                    item.totalPrice ??
                    (item.unitPrice * item.quantity)
                ).toLocaleString("cs-CZ")} Kč
            </p>

        </div>

    `;

}