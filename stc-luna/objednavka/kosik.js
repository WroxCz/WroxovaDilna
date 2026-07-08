import {
    renderUnknown,
    renderStock,
    renderRose,
    renderHelenka,
    renderTulip
} from "./renders/index.js";

let cart = JSON.parse(localStorage.getItem("lm-cart")) || [];

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

        total += item.unitPrice * item.quantity;
    }

    container.innerHTML = html;

    document.querySelectorAll(".remove-item").forEach(button => {

    button.addEventListener("click", () => {

        removeItem(button.dataset.uid);

    });

});

document.querySelectorAll(".qty-plus").forEach(button => {

    button.addEventListener("click", () => {

        changeQuantity(button.dataset.uid, 1);

    });

});

document.querySelectorAll(".qty-minus").forEach(button => {

    button.addEventListener("click", () => {

        changeQuantity(button.dataset.uid, -1);

    });

});

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
function removeItem(uid) {

    cart = cart.filter(item => item.uid !== uid);

    localStorage.setItem(
        "lm-cart",
        JSON.stringify(cart)
    );

    renderCart();

}
function changeQuantity(uid, delta) {

    const item = cart.find(item => item.uid === uid);

    if (!item) return;

    item.quantity += delta;

    if (item.quantity < 1) {
        item.quantity = 1;
    }

    localStorage.setItem(
        "lm-cart",
        JSON.stringify(cart)
    );

    renderCart();

}
function goToOrder() {
    window.location.href = "objednavka.html";
}

// zpřístupnění pro onclick v HTML
window.goToOrder = goToOrder;