import { formatPrice } from "../shared/formatPrice.js";
import { formatWeight } from "../shared/formatWeight.js";
import { formatPrintTime } from "../shared/formatPrintTime.js";

export function renderHelenka(item) {

    const plateCount = item.plates?.length ?? 0;
    const frameCount = item.frames?.length ?? 0;

    return `

        <div class="cart-item">

            <h2>${item.productName}</h2>

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
                                <strong>Destička ${index + 1}</strong>
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
                                <strong>Rámeček ${index + 1}</strong>
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