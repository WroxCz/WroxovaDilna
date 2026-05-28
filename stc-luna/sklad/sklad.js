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

Promise.all([


    fetch("data/pla-alzamet.json")
        .then(response => response.json()),
    
    fetch("data/pla-temu.json")
        .then(response => response.json()),
     
    fetch("data/ProfLab.json")
    .then(response => response.json())    

])

.then(allData => {

    allMaterials = allData.flat();

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

function applyFilters(){

    activeManufacturer = activeManufacturer.trim();
activeVariant = activeVariant.trim();
activeMaterial = activeMaterial.trim();

 console.log({
        material: activeMaterial,
        manufacturer: activeManufacturer,
        variant: activeVariant
    })

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

    if(activeVariant !== ""){

    filtered = filtered.filter(material =>
        material.variant.trim() === activeVariant
    );
}

    renderMaterials(filtered);
}
function updateVisibleFilters(){

    /* KDYŽ JE VŠE */

    if(activeMaterial === "Vše"){

    activeManufacturer = "Vše";
    activeVariant = "Vše";

    manufacturerBar.style.display =
    "none";

    variantBar.style.display =
    "none";

    /* OBNOVIT BUTTONY */

    document
    .querySelectorAll(
        ".manufacturer-button"
    )

    .forEach(button => {

        button.style.display =
        "inline-block";
    });

    document
    .querySelectorAll(
        ".variant-button"
    )

    .forEach(button => {

        button.style.display =
        "inline-block";
    });

    return;
}

    manufacturerBar.style.display =
"flex";

if(activeManufacturer === "Vše"){

    variantBar.style.display =
    "none";
}

else{

    variantBar.style.display =
    "flex";
}

    /* VÝROBCI */

    const availableManufacturers =
    allMaterials

    .filter(material =>
        material.material.toLowerCase() === activeMaterial.toLowerCase()
    )

    .map(material =>
        material.manufacturer
    );

    if(
    activeManufacturer !== "Vše"
    &&
    !availableManufacturers.includes(activeManufacturer)
){
    activeManufacturer = "Vše";
}

    document
    .querySelectorAll(
        ".manufacturer-button"
    )

    .forEach(button => {

        if(
            button.innerText.trim() === "Vše"
            ||
            availableManufacturers.includes(
                button.innerText.trim()
            )
        ){

            button.style.display =
            "inline-block";
        }

        else{

            button.style.display = "none";
            button.classList.remove("active");
        }
    });

    /* VARIANTY */

    const availableVariants =
allMaterials

.filter(material =>

    material.material.toLowerCase() === activeMaterial.toLowerCase()

    &&

    (
        activeManufacturer === "Vše"
        ||
        material.manufacturer.toLowerCase() === activeManufacturer.toLowerCase()
    )
)

.map(material =>
    material.variant
);

if(
    activeManufacturer !== "Vše"
    &&
    !availableManufacturers.includes(activeManufacturer)
){
    activeManufacturer = "Vše";
}

    document
    .querySelectorAll(
        ".variant-button"
    )

    .forEach(button => {

        if(
            button.innerText.trim() === "Vše"
            ||
            availableVariants.includes(
                button.innerText.trim()
            )
        ){

            button.style.display =
            "inline-block";
        }

        else{

            button.style.display =
            "none";
        }
    });
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
        button.innerText.trim();

        activeManufacturer = "Vše";
        activeVariant = "";

        /* RESET ACTIVE BUTTONŮ */

        document
        .querySelectorAll(".manufacturer-button")
        .forEach(btn =>
            btn.classList.remove("active")
        );

        document
        .querySelectorAll(".variant-button")
        .forEach(btn =>
            btn.classList.remove("active")
        );

        /* AKTIVOVAT VŠE */

        document
        .querySelectorAll(".variant-button")
        .forEach((btn) => {

            if(btn.innerText.trim() === "Vše"){

                btn.classList.add("active");
            }
        });

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

        applyFilters();
    });
});