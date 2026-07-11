import { formatPrice } from "../shared/formatPrice.js";
import { formatWeight } from "../shared/formatWeight.js";
import { formatPrintTime } from "../shared/formatPrintTime.js";

export function renderHelenka(item, showProduction = false) {

    const plateCount = item.plates?.length ?? 0;
    const frameCount = item.frames?.length ?? 0;

let itemStatus = "Čeká";

const states = [

    ...item.production.plates,

    ...item.production.frames

];

if (states.length > 0) {

    if (states.every(state => state === "Hotovo")) {

        itemStatus = "Hotovo";

    }

    else if (states.includes("Ve výrobě")) {

        itemStatus = "Ve výrobě";

    }

}    

item.production.plates =
    item.production.plates.map(status => {

        if (status === true) return "Hotovo";
        if (status === false) return "Čeká";

        return status;

    });

item.production.frames =
    item.production.frames.map(status => {

        if (status === true) return "Hotovo";
        if (status === false) return "Čeká";

        return status;

    });

while (item.production.plates.length < plateCount) {
    item.production.plates.push(false);
}

while (item.production.frames.length < frameCount) {
    item.production.frames.push(false);
}

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
                <strong>Litofánové destičky:</strong>
                ${plateCount}
            </p>

            <p>
                <strong>Rámečky:</strong>
                ${frameCount}
            </p>

            ${
                plateCount > 0
                ? `
                    <hr>

                    <h3>Destičky</h3>

                    ${item.plates.map((plate, index) => `

                        <div class="cart-subitem">

                            <p>
${showProduction ? `
<h3>

    Destička ${index + 1}

    Stav:

    <select
        class="part-status"
        data-uid="${item.uid}"
        data-part="plates"
        data-index="${index}">

        <option
            value="Čeká"
            ${item.production.plates[index] === "Čeká" ? "selected" : ""}>
            Čeká
        </option>

        <option
            value="Ve výrobě"
            ${item.production.plates[index] === "Ve výrobě" ? "selected" : ""}>
            Ve výrobě
        </option>

        <option
            value="Hotovo"
            ${item.production.plates[index] === "Hotovo" ? "selected" : ""}>
            Hotovo
        </option>

    </select>

</h3>
` : `
<h3>Destička ${index + 1}</h3>
`}
                            </p>

                            <p>
                                Fotografie:
                                ${plate.originalFileName || "Neuvedena"}
                            </p>

                            <p>
                                Orientace:
                                ${plate.orientation === "landscape"
                                    ? "Na šířku"
                                    : "Na výšku"}
                            </p>

                        </div>

                    `).join("")}
                `
                : ""
            }

            ${
                frameCount > 0
                ? `
                    <hr>

                    <h3>Rámečky</h3>

                    ${item.frames.map((frame, index) => `

                        <div class="cart-subitem">

                            <p>
${showProduction ? `
<h3>

    Rámeček ${index + 1}

    Stav:

    <select
        class="part-status"
        data-uid="${item.uid}"
        data-part="frames"
        data-index="${index}">

        <option
            value="Čeká"
            ${item.production.frames[index] === "Čeká" ? "selected" : ""}>
            Čeká
        </option>

        <option
            value="Ve výrobě"
            ${item.production.frames[index] === "Ve výrobě" ? "selected" : ""}>
            Ve výrobě
        </option>

        <option
            value="Hotovo"
            ${item.production.frames[index] === "Hotovo" ? "selected" : ""}>
            Hotovo
        </option>

    </select>

</h3>
` : `
<h3>Rámeček ${index + 1}</h3>
`}
                            </p>

                            <p>
                                Model:
                                ${frame.model}
                            </p>

                            <p>
                                Materiál:
                                ${frame.filament?.material ?? "-"}
                            </p>

                            <p>
                                Barva:
                                ${frame.filament?.name ?? "-"}
                            </p>

                            <p>
                                LED:
                                ${frame.ledPanel?.name ?? "Bez podsvícení"}
                            </p>

                            <p>
                                Adaptér:
                                ${frame.adapter?.name ?? "Ne"}
                            </p>

                        </div>

                    `).join("")}
                `
                : ""
            }

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