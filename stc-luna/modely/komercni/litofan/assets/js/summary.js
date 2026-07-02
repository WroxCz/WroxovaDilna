// ==========================================
// HELENKA - Summary
// ==========================================

"use strict";

function formatPrice(price) {

    return new Intl.NumberFormat("cs-CZ", {

        minimumFractionDigits: 2,

        maximumFractionDigits: 2

    }).format(price);

}

function formatPrintTime(minutes) {

    const hours = Math.floor(minutes / 60);

    const mins = minutes % 60;

    if (hours === 0) {

        return `${mins} min`;

    }

    if (mins === 0) {

        return `${hours} h`;

    }

    return `${hours} h ${mins} min`;

}

export class Summary {

    constructor(containerId) {

    this.container = document.getElementById(containerId);

    this.container.innerHTML = `

        <div class="summary-grid">

            <div class="summary-plates"></div>

            <div class="summary-frames"></div>

        </div>

        <div class="summary-total"></div>

    `;

    this.platesContainer =
        this.container.querySelector(".summary-plates");

    this.framesContainer =
        this.container.querySelector(".summary-frames");

    this.totalContainer =
        this.container.querySelector(".summary-total");

}

    // ======================================
    // Veřejná metoda
    // ======================================

    update(plates, frames, totals) {

        this.clear();

        this.renderPlates(plates);

        this.renderFrames(frames);

        this.renderTotals(totals);

    }

    // ======================================
    // Vymazání
    // ======================================

clear() {

    this.platesContainer.innerHTML = "";

    this.framesContainer.innerHTML = "";

    this.totalContainer.innerHTML = "";

}

    // ======================================
    // Litofánové destičky
    // ======================================

    renderPlates(plates) {

    if (!plates.length) return;

    const section = document.createElement("div");

    section.className = "summary-section";

    section.innerHTML = `
        <h3>📷 Litofánové destičky</h3>
    `;

    plates.forEach((plate, index) => {

        const item = document.createElement("div");

        item.className = "summary-item";

        item.innerHTML = `

            <h4>Destička ${index + 1}</h4>

            <div>
                Fotografie:
                ${plate.state.imageName || "Nevybrána"}
            </div>

            <div>
                Orientace:
                ${
                    plate.state.orientation === "landscape"
                        ? "Na šířku"
                        : "Na výšku"
                }
            </div>

            <div>
                Výroba destičky:
                ${formatPrice(
                    plate.state.price.material +
                    plate.state.price.printing
                )} Kč
            </div>

            <hr>

            <div>

                <strong>Celkem:</strong>

                <strong>
                    ${formatPrice(plate.state.price.total)} Kč
                </strong>

            </div>

        `;

        section.appendChild(item);

    });

    this.platesContainer.appendChild(section);

}

    // ======================================
    // Rámečky
    // ======================================

    renderFrames(frames) {

    if (!frames.length) return;

    const section = document.createElement("div");

    section.className = "summary-section";

    section.innerHTML = `
        <h3>🖼️ Rámečky</h3>
    `;

    frames.forEach((frame, index) => {

        const item = document.createElement("div");

        item.className = "summary-item";

        item.innerHTML = `

            <h4>Rámeček ${index + 1}</h4>

            <div>
                Model:
                ${frame.state.model || "Basic"}
            </div>

            <div>
                Materiál:
                ${frame.state.filament?.material || "-"}
            </div>

            <div>
                Barva:
                ${frame.state.filament?.name || "-"}
            </div>

            <div>
                Podsvícení:
                ${frame.state.ledPanel?.name || "Bez podsvícení"}
            </div>

            <div>
                Výroba rámečku:
                ${formatPrice(
                    frame.state.price.material +
                    frame.state.price.printing
                )} Kč
            </div>

            ${
                frame.state.ledPanel
                ? `
                <div>
                    LED panel:
                    ${formatPrice(frame.state.price.led)} Kč
                </div>
                `
                : ""
            }

            ${
                frame.state.adapter
                ? `
                <div>
                    Síťový adaptér:
                    ${formatPrice(frame.state.price.adapter)} Kč
                </div>
                `
                : ""
            }

            <hr>

            <div>

                <strong>Celkem:</strong>

                <strong>
                    ${formatPrice(frame.state.price.total)} Kč
                </strong>

            </div>

        `;

        section.appendChild(item);

    });

    this.framesContainer.appendChild(section);

}

    // ======================================
    // Součty
    // ======================================

    renderTotals(totals) {

    const section = document.createElement("div");

    section.className = "summary-total-card";

    section.innerHTML = `

        <h3>📊 Celkový souhrn</h3>

        <div>
            <strong>Celková cena:</strong>
            ${formatPrice(totals.price)} Kč
        </div>

        <div>
            <strong>Celková hmotnost:</strong>
            ${totals.weight} g
        </div>

        <div>
            <strong>Celková doba tisku:</strong>
            ${formatPrintTime(totals.printTime)}
        </div>

    `;

    this.totalContainer.appendChild(section);

}
}