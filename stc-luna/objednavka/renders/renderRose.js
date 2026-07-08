import { formatPrice } from "../shared/formatPrice.js";
import { formatWeight } from "../shared/formatWeight.js";
import { formatPrintTime } from "../shared/formatPrintTime.js";

export function renderRose(item) {

    const sizeNames = {
        s: "5 cm",
        m: "7 cm",
        l: "10 cm"
    };

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

            <hr>

            <p>
                <strong>Hmotnost:</strong>
                ${formatWeight(item.unitWeight)}
            </p>

            <p>
                <strong>Doba tisku:</strong>
                ${formatPrintTime(item.unitPrintTime)}
            </p>

            <p>
                <strong>Cena:</strong>
                ${formatPrice(item.unitPrice)}
            </p>

        </div>

    `;

}