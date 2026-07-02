// ==========================================
// HELENKA - Summary
// ==========================================

"use strict";

export class Summary {

    constructor(containerId) {

        this.container = document.getElementById(containerId);

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

        this.container.innerHTML = "";

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

                <div>Fotografie:
                    ${plate.state.imageName || "Nevybrána"}
                </div>

                <div>Orientace:
                    ${plate.state.orientation === "landscape"
                        ? "Na šířku"
                        : "Na výšku"}
                </div>

                <div>Cena:
                    bude doplněna
                </div>

            `;

            section.appendChild(item);

        });

        this.container.appendChild(section);

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

                <div>Model:
                    ${frame.state?.model || "Basic"}
                </div>

                <div>Materiál:
    ${frame.state.material || "-"}
</div>

<div>Barva:
    ${frame.state.color || "-"}
</div>

<div>Podsvícení:
    ${frame.state.led === "basic"
        ? "LED panel Basic"
        : "Bez podsvícení"}
</div>

<div>Adaptér:
    ${frame.state.adapter ? "Ano" : "Ne"}
</div>

                <div>Cena:
                    bude doplněna
                </div>

            `;

            section.appendChild(item);

        });

        this.container.appendChild(section);

    }

    // ======================================
    // Součty
    // ======================================

    renderTotals(totals) {

    const section = document.createElement("div");

    section.className = "summary-total";

    section.innerHTML = `

        <hr>

        <div>
            Celková cena:
            ${totals.price} Kč
        </div>

        <div>
            Celková hmotnost:
            ${totals.weight} g
        </div>

        <div>
            Celková doba tisku:
            ${totals.printTime} min
        </div>

    `;

    this.container.appendChild(section);

}
}