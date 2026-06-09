
function vytvorModel(model) {

    const container = document.getElementById(model.category + "-list");

    let sub = document.getElementById("sub-" + model.subcategory);

    if (!sub) {

        const subTitle = document.createElement("h3");

        subTitle.textContent = model.subcategory;

        subTitle.id = "sub-" + model.subcategory;

        container.appendChild(subTitle);

        sub = document.createElement("div");

        sub.id = "models-" + model.subcategory;

        container.appendChild(sub);
    }

    const link = document.createElement("a");

    link.href = model.path;

    link.textContent = model.name;

    link.className = "model-link";

    document
        .getElementById("models-" + model.subcategory)
        .appendChild(link);
}


import { sekce as komercni } from "./komercni/komercni.js";

console.log("Komerční:", komercni);



const dekorace = 
    await import("./komercni/dekorace/dekorace.js");
const testovaci = 
    await import("./testovaci-modely/testovaci.js");
const ukazkove =
    await import("./ukazkovy-tisk/ukazkove.js");

console.log("Dekorace:", dekorace.sekce);

function vykresliStrom(data, container) {

    data.forEach(item => {

        // Kategorie
        if (item.children) {

            const details = document.createElement("details");

            const summary = document.createElement("summary");

            summary.textContent = item.name;

            details.appendChild(summary);

            const content = document.createElement("div");

            vykresliStrom(item.children, content);

            details.appendChild(content);

            container.appendChild(details);
        }
else if (item.file) {

    const details = document.createElement("details");

    const summary = document.createElement("summary");

    summary.textContent = item.name;

    details.appendChild(summary);

    const content = document.createElement("div");

    details.appendChild(content);

    details.addEventListener("toggle", async () => {

        if (!details.open || content.dataset.loaded) return;

        const modul = await import(item.file);

        vykresliStrom(
    modul.sekce || modul.modely,
    content
);

        content.dataset.loaded = "true";
    });

    container.appendChild(details);
}
        // Model
        else if (item.path) {

            const link = document.createElement("a");

            link.href = item.path;

            link.textContent = item.name;

            link.className = "model-link";

            container.appendChild(link);
        }
    });
}
const dekoraceContainer =
    document.getElementById("dekorace-list");

vykresliStrom(
    dekorace.sekce,
    dekoraceContainer
);
const testovaciContainer =
    document.getElementById("testovaci-modely-list");

vykresliStrom(
    testovaci.sekce,
    testovaciContainer
);
const ukazkoveContainer =
    document.getElementById("ukazkovy-tisk-list");

vykresliStrom(
    ukazkove.sekce,
    ukazkoveContainer
);