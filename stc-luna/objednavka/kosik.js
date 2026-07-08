import {
    renderUnknown,
    renderStock,
    renderRose,
    renderHelenka,
    renderTulip
} from "./renders/index.js";

const cart = JSON.parse(localStorage.getItem("lm-cart")) || [];

renderCart();

function renderCart() {

    const container = document.getElementById("cart-items");

    if (cart.length === 0) {

        container.innerHTML = `
            <p>Košík je prázdný.</p>
        `;

        document.getElementById("cart-total").textContent = "0 Kč";
        return;
    }

    let html = "";
    let total = 0;

    for (const item of cart) {

        html += renderCartItem(item);

        total += Number(item.totalPrice ?? (
            item.unitPrice * item.quantity
        ));
    }

    container.innerHTML = html;

    document.getElementById("cart-total").textContent =
        total.toLocaleString("cs-CZ") + " Kč";
}

function renderCartItem(item) {

if (item.type === "helenka") {
    return renderHelenka(item);
}

    switch (item.productId) {

        case "stock":
            return renderStock(item);

        case "rose-spiral-vase":
            return renderRose(item);

        case "tulip-with-stem":
            return renderTulip(item);

        case "projekt-helenka":
            return renderHelenka(item);

        default:
            return renderUnknown(item);

    }

}
