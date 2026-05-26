document
.getElementById("orderForm")
.addEventListener("submit", function(e){

    e.preventDefault();

    alert("Objednávka odeslána do Forge World.");
});

/* MODEL Z URL */

const params =
new URLSearchParams(window.location.search);

const modelName =
params.get("model");
const modelWeight =
params.get("weight");
const printTime =
params.get("time");

if(modelName){

    const modelInput =
    document.querySelector("#modelInput");

    modelInput.value = modelName;

    modelInput.readOnly = true;
}

/* SKLAD */

let allMaterials = [];

Promise.all([

    fetch("/WroxovaDilna/stc-luna/sklad/data/pla-alzamet.json")
        .then(response => response.json()),

    fetch("/WroxovaDilna/stc-luna/sklad/data/pla-alzamet-mat.json")
        .then(response => response.json()),

    fetch("/WroxovaDilna/stc-luna/sklad/data/pla-temu.json")
        .then(response => response.json())

])

.then(allData => {

    allMaterials = allData.flat();

    console.log(allMaterials);

    loadMaterials();
});

/* MATERIÁLY */

function loadMaterials(){

    const materialSelect =
    document.querySelector("#materialSelect");

    const uniqueMaterials =
    [...new Set(

        allMaterials

        .filter(material =>

            material.status !== "unavailable"
        )

        .map(material =>

            material.material
        )
    )];

    materialSelect.innerHTML =
    `<option value="">
        Vyberte materiál
    </option>`;

    uniqueMaterials.forEach(material => {

        materialSelect.innerHTML += `

        <option value="${material}">
            ${material}
        </option>

        `;
    });
}

/* BARVY */
document
.querySelector("#materialSelect")

.addEventListener("change", function(){

    const selectedMaterial =
    this.value;

    const manufacturerSelect =
    document.querySelector(
        "#manufacturerSelect"
    );

    const filteredManufacturers =
    [...new Set(

        allMaterials

        .filter(material =>

            material.material === selectedMaterial
            &&
            material.status !== "unavailable"
        )

        .map(material =>
            material.variant || "Standard"
        )
    )];

    manufacturerSelect.innerHTML =
    `<option value="">
        Vyberte druh
    </option>`;

    filteredManufacturers.forEach(manufacturer => {

        manufacturerSelect.innerHTML += `

        <option value="${manufacturer}">
            ${manufacturer}
        </option>

        `;
    });
});
document
.querySelector("#manufacturerSelect")

.addEventListener("change", function(){

    const selectedMaterial =
    document.querySelector(
        "#materialSelect"
    ).value;

    const selectedManufacturer =
    this.value;

    const colorSelect =
    document.querySelector(
        "#colorSelect"
    );

    const filteredColors =
    allMaterials.filter(material =>

        material.material === selectedMaterial
        &&
        (material.variant || "Standard")
        ===
        selectedManufacturer
        &&
        material.status !== "unavailable"
    );

    colorSelect.innerHTML =
    `<option value="">
        Vyberte barvu
    </option>`;
filteredColors.forEach(material => {

    colorSelect.innerHTML += `

    <option value="${material.id}">
        ${material.name}
    </option>

    `;

});
    
});


/* VÝPOČET CENY */

function calculatePrice(){

    const selectedColorId =
    document.querySelector("#colorSelect").value;

    const selectedMaterial =
    allMaterials.find(material =>

        String(material.id).trim() ===
        String(selectedColorId).trim()
    );

    console.log(selectedColorId);
    console.log(selectedMaterial);
    console.log(modelWeight);
    console.log(printTime);

    /* KONTROLA */

    if(!selectedMaterial){

        document.querySelector(
            ".price-value"
        ).innerText = "0 Kč";

        return;
    }

    /* VÁHA MODELU */

    const weight =
    Number(modelWeight) || 0;

    const quantity =
    Number(
        document.querySelector(
            "#quantityInput"
        ).value
    ) || 1;

    const time =
    Number(printTime) || 0;

    /* CENA ZA GRAM */

    const materialPricePerGram =

    selectedMaterial.price
    /
    (selectedMaterial.weight * 1000);

    /* NÁSOBITEL MATERIÁLU */

    let multiplier = 2.4;

    if(selectedMaterial.variant === "Matte"){

        multiplier = 2.5;
    }

    if(selectedMaterial.variant === "Silk"){

        multiplier = 3.0;
    }

    /* NÁSOBITEL ČASU */

    let timeMultiplier = 1;

    if(selectedMaterial.variant === "Matte"){

        timeMultiplier = 1.05;
    }

    if(selectedMaterial.variant === "Silk"){

        timeMultiplier = 1.2;
    }

    /* VÝSLEDNÁ CENA */

    let result =

    (
        weight
        *
        quantity
        *
        materialPricePerGram
        *
        multiplier
    )

    +

    (
        (time * timeMultiplier)
        *
        0.6
    );

    /* MINIMÁLNÍ CENA */

    if(result < 99){

        result = 99;
    }

    /* ZOBRAZENÍ */

    document.querySelector(
        ".price-value"
    ).innerText =

    `${Math.round(result)} Kč`;


/* ZOBRAZENÍ */

    document.querySelector(
        ".price-value"
    ).innerText =

    `${Math.round(result)} Kč`;
}

/* AKTUALIZACE CENY */

document
.querySelector("#colorSelect")
.addEventListener("change", calculatePrice);
document
.querySelector("#quantityInput")
.addEventListener("input", calculatePrice);