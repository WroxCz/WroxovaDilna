import { db } from "../../firebase/firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    getDoc,
    runTransaction

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

document
.getElementById("orderForm")
.addEventListener("submit", async function(e){

    e.preventDefault();

    try{

let orderNumber = 1001;

await runTransaction(db, async (transaction) => {

    const counterRef =
    doc(db, "system", "orderCounter");

    const counterDoc =
    await transaction.get(counterRef);

    if(!counterDoc.exists()){

        transaction.set(
            counterRef,
            { current: 1001 }
        );

        orderNumber = 1001;
    }

    else{

        orderNumber =
        counterDoc.data().current + 1;

        transaction.update(
            counterRef,
            {
                current: orderNumber
            }
        );
    }
});


        const orderData = {

            customerName:
            document.querySelector("#nameInput").value,

            email:
            document.querySelector("#emailInput").value,

            phone:
            document.querySelector("#phoneInput").value,

            model:
            document.querySelector("#modelInput").value,

            modelPath: modelPath,

            orderNumber: orderNumber,

            quantity:
            Number(
                document.querySelector(
                    "#quantityInput"
                ).value
            ),

            material:
            document.querySelector(
                "#materialSelect"
            ).value,

            manufacturer:
            document.querySelector(
                "#manufacturerSelect"
            ).value,

            variant:
            document.querySelector(
                "#variantSelect"
            ).value,

            color:
            document.querySelector(
                "#colorSelect"
            ).selectedOptions[0].text,

            delivery:
            document.querySelector(
                "#deliverySelect"
            ).value,

            price:
            Number(
                document.querySelector(
                    "#priceInput"
                ).value
            ),

            note:
            document.querySelector(
                "#noteInput"
            ).value,
            adminNote: "",

            status: "Nová",

            paymentStatus:
            "Nezaplaceno",

            created:
            serverTimestamp(),

            completed: null
        };

        await addDoc(
            collection(db, "orders"),
            orderData
        );

        alert(
            "Objednávka byla úspěšně odeslána."
        );

        document
        .getElementById("orderForm")
        .reset();

    }

    catch(error){

        console.error(error);

        alert(
            "Nepodařilo se uložit objednávku."
        );
    }

});

/* MODEL Z URL */

const params =
new URLSearchParams(window.location.search);

const modelName =
params.get("model");
const modelWeight =
params.get("weight");
const printTimeMinutes =
params.get("time");
const valueFactor =
Number(params.get("valueFactor")) || 1;
const modelPath =
params.get("modelPath") || "";

console.log("MODEL PATH:", modelPath);

if(modelName){

    const modelInput =
    document.querySelector("#modelInput");

    modelInput.value = modelName;

    modelInput.readOnly = true;
}

/* SKLAD */

let allMaterials = [];

Promise.all([

    fetch("../sklad/data/pla-alzamet.json")
        .then(response => response.json()),

    fetch("../sklad/data/pla-temu.json")
        .then(response => response.json()),

    fetch("../sklad/data/ProfLab.json")
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

        .map(material => material.manufacturer)
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
    document.querySelector("#materialSelect").value;

    const selectedManufacturer =
    this.value;

    const variantSelect =
    document.querySelector("#variantSelect");

    const variants =
    [...new Set(

        allMaterials

        .filter(material =>

            material.material === selectedMaterial &&
            material.manufacturer === selectedManufacturer &&
            material.status !== "unavailable"
        )

        .map(material =>
            material.variant || "Standard"
        )
    )];

    variantSelect.innerHTML =
    `<option value="">
        Vyberte typ materiálu
    </option>`;

    variants.forEach(variant => {

        variantSelect.innerHTML += `

        <option value="${variant}">
            ${variant}
        </option>

        `;
    });

});
document
.querySelector("#variantSelect")
.addEventListener("change", function(){

    const selectedMaterial =
    document.querySelector("#materialSelect").value;

    const selectedManufacturer =
    document.querySelector("#manufacturerSelect").value;

    const selectedVariant =
    this.value;

    const colorSelect =
    document.querySelector("#colorSelect");

    const filteredColors =

    allMaterials.filter(material =>

        material.material === selectedMaterial &&
        material.manufacturer === selectedManufacturer &&
        material.variant === selectedVariant &&
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
    console.log(printTimeMinutes);

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

    const timeMinutes =
Number(printTimeMinutes) || 0;

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
        (timeMinutes * timeMultiplier)
        *
        0.6
    )

)
*
valueFactor;

    /* MINIMÁLNÍ CENA */

    if(result < 99){

        result = 99;
    }

/* ZOBRAZENÍ */

    document.querySelector(
        ".price-value"
    ).innerText =

    `${Math.round(result)} Kč`;
    document.querySelector(
    "#priceInput"
).value = Math.round(result);
}

/* AKTUALIZACE CENY */

document
.querySelector("#colorSelect")
.addEventListener("change", calculatePrice);
document
.querySelector("#quantityInput")
.addEventListener("input", calculatePrice);