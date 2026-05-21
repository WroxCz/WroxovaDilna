let allMaterials = [];

Promise.all([

    fetch("data/pla-elegoo.json")
        .then(response => response.json()),

    fetch("data/pla-alzamet.json")
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

                <p class="${material.status}">
                    ${material.statusText}
                </p>

            </div>

        </div>

        `;
    });
}

/* FILTRACE MATERIÁLŮ */

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

        const filter =
        button.innerText;

        if(filter === "Vše"){

            renderMaterials(allMaterials);

            return;
        }

        const filtered =
        allMaterials.filter(material =>

            material.material === filter
        );

        renderMaterials(filtered);
    });
});

/* FILTRACE VÝROBCŮ */

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

        const filter =
        button.innerText;

        if(filter === "Vše"){

            renderMaterials(allMaterials);

            return;
        }

        const filtered =
        allMaterials.filter(material =>

            material.manufacturer === filter
        );

        renderMaterials(filtered);
    });
});