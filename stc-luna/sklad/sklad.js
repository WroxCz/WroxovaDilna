let allMaterials = [];

let activeMaterial = "Vše";
let activeManufacturer = "Vše";
let activeVariant = "Vše";

Promise.all([

    fetch("data/pla-elegoo.json")
        .then(response => response.json()),

    fetch("data/pla-alzamet.json")
        .then(response => response.json()),
    
    fetch("data/pla-alzamet-mat.json")
        .then(response => response.json()),        

    fetch("data/pla-temu.json")
        .then(response => response.json())          
])

.then(allData => {

    allMaterials = allData.flat();

    renderMaterials(allMaterials);

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

function applyFilters(){

    let filtered = allMaterials;

    if(activeMaterial !== "Vše"){

        filtered = filtered.filter(material =>
            material.material === activeMaterial
        );
    }

    if(activeManufacturer !== "Vše"){

        filtered = filtered.filter(material =>
            material.manufacturer === activeManufacturer
        );
    }

    if(activeVariant !== "Vše"){

        filtered = filtered.filter(material =>
            material.variant === activeVariant
        );
    }

    renderMaterials(filtered);
}

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
        button.innerText;

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
        button.innerText;

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
        button.innerText;

        applyFilters();
    });
});