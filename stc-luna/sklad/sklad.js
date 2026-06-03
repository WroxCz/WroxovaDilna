let allMaterials = [];

let activeMaterial = "Vše";
let activeManufacturer = "Vše";
let activeVariant = "";

const manufacturerBar =
document.getElementById(
    "manufacturer-bar"
);

const variantBar =
document.getElementById(
    "variant-bar"
);

const filterBar =
document.getElementById(
    "filter-bar"
);

Promise.all([


    fetch("data/pla-standard.json")
        .then(response => response.json()),
    
    fetch("data/pla-matte.json")
        .then(response => response.json()),
     
    fetch("data/pla-silk.json")
    .then(response => response.json()),    

    fetch("data/petg-standard.json")
    .then(response => response.json()),  

    fetch("data/petg-matte.json")
    .then(response => response.json()),  

    fetch("data/petg-special.json")
    .then(response => response.json()),  

    fetch("data/petg-cf.json")
    .then(response => response.json())  
    

])

.then(allData => {

    allMaterials = allData.flat();

    createFilters();

    bindFilterEvents();

    renderMaterials(allMaterials);

    updateVisibleFilters();

});

function renderMaterials(data){

    const container =
    document.getElementById(
        "inventory-container"
    );

    container.innerHTML = "";

    data.forEach(material => {

        if(material.status === "unavailable")
        return;

        container.innerHTML += `

        <div class="inventory-panel">

            <img src="${material.image}">

            <div class="panel-content">

                <h2>${material.name}</h2>

                <p>${material.manufacturer}</p>

                <p>
                    ${material.material}
                    ${material.variant}            
                </p>

                <p>
                    ${Math.round(
                    material.price / material.weight
                    )}
                    Kč / kg
                </p>

                <p class="${material.status}">
                    ${material.statusText}
                </p>

            </div>

        </div>

        `;
    });
}

function createFilters(){

    const materials = [

        "Vše",

        ...new Set(
            allMaterials.map(
                m => m.material
            )
        )
    ];

    filterBar.innerHTML =
    materials.map(material => `

        <button
            class="filter-button
            ${material === "Vše" ? "active" : ""}">

            ${material}

        </button>

    `).join("");
}

function applyFilters(){

activeManufacturer = activeManufacturer.trim();
activeVariant = activeVariant.trim();
activeMaterial = activeMaterial.trim();

    let filtered = allMaterials;

    if(activeMaterial !== "Vše"){

        filtered = filtered.filter(material =>
            material.material.toLowerCase() === activeMaterial.toLowerCase()
        );
    }

    if(activeManufacturer !== "Vše"){

    filtered = filtered.filter(material =>
        material.manufacturer.trim() === activeManufacturer.trim()
    );
}

    if(
    activeVariant !== ""
    &&
    activeVariant !== "Vše"
){

    filtered = filtered.filter(material =>
        material.variant.trim() === activeVariant
    );
}

    renderMaterials(filtered);
}
function updateVisibleFilters(){

    if(activeMaterial === "Vše"){

    activeManufacturer = "Vše";
    activeVariant = "";

    manufacturerBar.style.display =
    "none";

    variantBar.style.display =
    "none";

    manufacturerBar.innerHTML = "";
    variantBar.innerHTML = "";    

bindFilterEvents();

    return;
}

    manufacturerBar.style.display =
"none";

variantBar.style.display =
"flex";
   
const variants = [

    "Vše",

    ...new Set(

        allMaterials

        .filter(material =>

            activeMaterial === "Vše"

            ||

            material.material === activeMaterial

        )

        .map(material => material.variant)

    )

];

variantBar.innerHTML =

variants.map(variant => `

    <button
        class="variant-button
        ${variant === activeVariant ? "active" : ""}">

        ${variant}

    </button>

`).join("");

const manufacturers = [

    "Vše",

    ...new Set(

        allMaterials

        .filter(material =>

            material.material === activeMaterial

            &&

            (
                activeVariant === ""
                ||
                activeVariant === "Vše"
                ||
                material.variant === activeVariant
            )

        )

        .map(material =>
            material.manufacturer
        )

    )

];

manufacturerBar.innerHTML =

manufacturers.map(manufacturer => `

    <button
        class="manufacturer-button
        ${manufacturer === activeManufacturer ? "active" : ""}">

        ${manufacturer}

    </button>

`).join("");

manufacturerBar.style.display =
"flex";

bindFilterEvents();
}

function bindFilterEvents(){

    /* MATERIÁL */

    document
    .querySelectorAll(".filter-button")

    .forEach(button => {

        button.addEventListener("click", () => {

            document
            .querySelectorAll(".filter-button")

            .forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            activeMaterial =
            button.innerText.trim();

            activeManufacturer = "Vše";
            activeVariant = "Vše";

            updateVisibleFilters();

            applyFilters();

        });

    });



    /* VÝROBCE */

    document
    .querySelectorAll(".manufacturer-button")

    .forEach(button => {

        button.addEventListener("click", () => {

            document
            .querySelectorAll(".manufacturer-button")

            .forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            activeManufacturer =
            button.innerText.trim();

            updateVisibleFilters();

            applyFilters();

        });

    });



    /* VARIANTA */

    document
    .querySelectorAll(".variant-button")

    .forEach(button => {

        button.addEventListener("click", () => {

            document
            .querySelectorAll(".variant-button")

            .forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            activeVariant =
            button.innerText.trim();

            updateVisibleFilters();

            applyFilters();

        });

    });

}