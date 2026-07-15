import { loadMaterials } from "./materialLoader.js";

const materials = await loadMaterials();

function getMaterials(source) {

    return materials.filter(material =>

        material.source === source &&
        (
            material.status === "available" ||
            material.status === "ordered"
        )

    );

}

console.log(materials[0]);

console.log(
    materials.filter(m => m.material === "PLA")
);

const plaStandard = materials.filter(material =>

    material.source === "pla-standard" &&
    (
        material.status === "available" ||
        material.status === "ordered"
    )

);
const plaMatte = materials.filter(material =>

    material.source === "pla-matte" &&
    (
        material.status === "available" ||
        material.status === "ordered"
    )

);

const plaSilk = materials.filter(material =>

    material.source === "pla-silk" &&
    (
        material.status === "available" ||
        material.status === "ordered"
    )

);

const plaWood = materials.filter(material =>

    material.source === "pla-wood" &&
    (
        material.status === "available" ||
        material.status === "ordered"
    )

);

const petgStandard = materials.filter(material =>

    material.source === "petg-standard" &&
    (
        material.status === "available" ||
        material.status === "ordered"
    )

);

const petgMatte = materials.filter(material =>

    material.source === "petg-matte" &&
    (
        material.status === "available" ||
        material.status === "ordered"
    )

);

const petgCF = materials.filter(material =>

    material.source === "petg-cf" &&
    (
        material.status === "available" ||
        material.status === "ordered"
    )

);

const petgSpecial = materials.filter(material =>

    material.source === "petg-special" &&
    (
        material.status === "available" ||
        material.status === "ordered"
    )

);

console.log(plaStandard);

const detailsTitle = document.getElementById("details-title");
const detailsDescription = document.getElementById("details-description");
const detailsContent = document.getElementById("details-content");

function renderFilaments(title, description, list) {

    detailsTitle.textContent = title;
    detailsDescription.textContent = description;

    detailsContent.innerHTML = "";

    list.forEach(material => {

        detailsContent.innerHTML += `
            <div class="filament-row">

                <img src="${material.image}" alt="${material.name}">

                <div class="filament-info">
                    <h3>${material.name}</h3>

                    <p>
                        ${material.manufacturer}<br>
                        ${material.price} Kč / kg
                    </p>
                </div>

                <div class="filament-status ${material.status}">
                    ${material.statusText}
                </div>

            </div>
        `;

    });

}

function registerCard(cardId, source, title, description) {

    document.getElementById(cardId).addEventListener("click", () => {

        document.querySelectorAll(".material-card").forEach(card => {

            card.classList.remove("active");

        });

        document.getElementById(cardId).classList.add("active");

        renderFilaments(

            title,
            description,
            getMaterials(source)

        );

        document.querySelector(".details-panel").scrollIntoView({

            behavior: "smooth",
            block: "start"

        });

    });

}

registerCard(
    "pla-standard",
    "pla-standard",
    "PLA Standard",
    "Aktuálně dostupné a objednané filamenty PLA Standard."
);

registerCard(
    "pla-matte",
    "pla-matte",
    "PLA Matte",
    "Aktuálně dostupné a objednané filamenty PLA Matte."
);

registerCard(
    "pla-silk",
    "pla-silk",
    "PLA Silk",
    "Aktuálně dostupné a objednané filamenty PLA Silk."
);

registerCard(
    "pla-wood",
    "pla-wood",
    "PLA Wood",
    "Aktuálně dostupné a objednané filamenty PLA Wood."
);

registerCard(
    "petg-standard",
    "petg-standard",
    "PETG Standard",
    "Aktuálně dostupné a objednané filamenty PETG Standard."
);

registerCard(
    "petg-matte",
    "petg-matte",
    "PETG Matte",
    "Aktuálně dostupné a objednané filamenty PETG Matte."
);

registerCard(
    "petg-cf",
    "petg-cf",
    "PETG CF",
    "Aktuálně dostupné a objednané filamenty PETG CF."
);

registerCard(
    "petg-special",
    "petg-special",
    "PETG Special",
    "Aktuálně dostupné a objednané filamenty PETG Special."
);