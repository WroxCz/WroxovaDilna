// ==========================================
// HELENKA – litofan.js (clean rebuild)
// ==========================================
"use strict";
import { loadMaterials } from "../../../../../sklad/materialLoader.js";
import { Summary } from "./summary.js";
import { calculateProject } from "./priceCalculator.js";
import { loadModelData, loadPlateData } from "./dataLoader.js";
import { loadLedPanels } from "./ledLoader.js";
import { loadAdapters } from "./adapterLoader.js";
import { uploadPhoto } from "./storageManager.js";

// ==========================================
// Aktualizace shrnutí
// ==========================================

function refreshSummary() {

    if (!summary || !plateManager || !frameManager) return;

    const totals = calculateProject(

        plateManager.plates,

        frameManager.frames

    );

    summary.update(

        plateManager.plates,

        frameManager.frames,

        totals

    );

}


/* =========================================
   PLATE COMPONENT
========================================= */
class Plate {

    constructor(fragment, index) {
        this.root = fragment.querySelector(".plate-card");

        this.title = fragment.querySelector(".plate-title h4");
        this.fileInput = fragment.querySelector('input[type="file"]');
        this.img = fragment.querySelector(".photo-image");
        this.uploadText = fragment.querySelector(".upload-text");

        this.canvas = fragment.querySelector(".preview-canvas");
        this.ctx = this.canvas.getContext("2d");

        this.previewBox = fragment.querySelector(".preview-box");

        this.orientationInputs = fragment.querySelectorAll(".orientation-radio");
        this.modeInputs = fragment.querySelectorAll(".preview-mode-radio");

        this.state = {

    image: null,

    imageName: "",

    imageUrl: "",

    storagePath: "",

    orientation: "portrait",

    mode: "lit",

    filament: null,

    weight: 0,

    printTime: 0,

    price: {

        material: 0,

        printing: 0,

        total: 0

    }

};

        this.setTitle(index);

this.loadData();

this.setupCanvas();

this.bind(index);

this.renderBlank();
    }

    /* -------------------------
       INIT
    ------------------------- */
    setTitle(i) {
        this.title.textContent = `Destička ${i}`;
    }

    setupCanvas() {
        this.canvas.width = 600;
        this.canvas.height = 800;
    }

async loadData() {

    const data = await loadPlateData();

    this.state.weight = data.weight;

    this.state.printTime = data.printTime;

    const materials = await loadMaterials();

    this.state.filament = materials.find(
        m => m.id === data.defaultFilament
    ) || null;

    refreshSummary();

}

    bind(index) {

        this.orientationInputs.forEach(r => r.name = `orientation-${index}`);
        this.modeInputs.forEach(r => r.name = `mode-${index}`);

        this.fileInput.addEventListener("change", e => this.loadImage(e));

        this.orientationInputs.forEach(r => {
            r.addEventListener("change", () => {
                if (!r.checked) return;

                this.state.orientation = r.value;
                this.previewBox.classList.toggle("landscape", r.value === "landscape");

                this.render();

                refreshSummary();
            });
        });

        this.modeInputs.forEach(r => {
            r.addEventListener("change", () => {
                if (!r.checked) return;

                this.state.mode = r.value;
                this.render();
                refreshSummary();
            });
        });
    }

    /* -------------------------
       IMAGE LOAD
    ------------------------- */
    async loadImage(e) {

    const file = e.target.files[0];

    if (!file) return;

    this.state.imageName = file.name;

    try {

        const projectId = window.helenkaProjectId ??
            (window.helenkaProjectId = crypto.randomUUID());

        const upload = await uploadPhoto(file, projectId);

        this.state.imageUrl = upload.url;

        this.state.storagePath = upload.path;

        console.log("Fotografie nahrána:", upload);

    }
    catch (err) {

        console.error(err);

        alert("Fotografii se nepodařilo nahrát.");

        return;

    }

        const url = URL.createObjectURL(file);

        this.img.src = url;
        this.img.style.display = "block";
        this.uploadText.style.display = "none";

        const image = new Image();

        image.onload = () => {

    this.state.image = image;

    this.render();

    refreshSummary();

};

        image.src = url;
    }

    /* -------------------------
       RENDER CORE
    ------------------------- */
    renderBlank() {
        this.ctx.fillStyle = "#e8e0cf";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render() {
        if (!this.state.image) return;

        // resize canvas safely
        if (this.state.orientation === "portrait") {
            this.canvas.width = 600;
            this.canvas.height = 800;
        } else {
            this.canvas.width = 800;
            this.canvas.height = 600;
        }

        this.drawImage();
        this.applyEffect();
    }

    drawImage() {
        const img = this.state.image;

        const rImg = img.width / img.height;
        const rCanvas = this.canvas.width / this.canvas.height;

        let w, h, x, y;

        if (rImg > rCanvas) {
            h = this.canvas.height;
            w = h * rImg;
            x = (this.canvas.width - w) / 2;
            y = 0;
        } else {
            w = this.canvas.width;
            h = w / rImg;
            x = 0;
            y = (this.canvas.height - h) / 2;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(img, x, y, w, h);
    }

    applyEffect() {
        const imgData = this.ctx.getImageData(
            0, 0,
            this.canvas.width,
            this.canvas.height
        );

        const data = imgData.data;

        // grayscale base
        for (let i = 0; i < data.length; i += 4) {
            const g =
                data[i] * 0.299 +
                data[i + 1] * 0.587 +
                data[i + 2] * 0.114;

            data[i] = data[i + 1] = data[i + 2] = g;
        }

        if (this.state.mode === "lit") {
            this.applyLit(data);
        } else {
            this.applyUnlit(data);
        }

        this.ctx.putImageData(imgData, 0, 0);
    }

    applyLit(data) {

    for (let i = 0; i < data.length; i += 4) {

        // základ = už grayscale z applyEffect()
        let v = data[i] / 255;

        // klíč litofánu = gamma křivka (NE inverze)
        v = Math.pow(v, 0.75);

        // simulace světla zezadu (jemné zesvětlení středů)
        v = v * 255;

        // lehký „backlight boost“
        v = v + 15;

        v = Math.min(255, v);

        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
    }
}

    applyUnlit(data) {

        const copy = new Uint8ClampedArray(data);

        for (let y = 1; y < this.canvas.height - 1; y++) {
            for (let x = 1; x < this.canvas.width - 1; x++) {

                const i = (y * this.canvas.width + x) * 4;

                const l = copy[i - 4];
                const r = copy[i + 4];
                const u = copy[i - this.canvas.width * 4];
                const d = copy[i + this.canvas.width * 4];

                let e = 128 + ((r - l) + (d - u)) * 0.4;
                e = Math.max(0, Math.min(255, e));

                const v = e * 0.75 + 55;

                data[i] = v;
                data[i + 1] = v * 0.98;
                data[i + 2] = v * 0.94;
            }
        }
    }
}

/* =========================================
   MANAGER
========================================= */
class PlateManager {

    constructor() {
        this.container = document.getElementById("plates-container");
        this.template = document.getElementById("plate-template");

        this.addBtn = document.querySelector(".btn-add-plate");
        this.removeBtn = document.querySelector(".btn-remove-plate");

        this.plates = [];

        this.bind();

    }

    bind() {
        this.addBtn.addEventListener("click", () => this.addPlate());
        this.removeBtn.addEventListener("click", () => this.removePlate());
    }
addPlate() {

    const fragment = this.template.content.cloneNode(true);

    const plate = new Plate(
        fragment,
        this.plates.length + 1
    );

    this.plates.push(plate);

    this.container.appendChild(fragment);

    this.sync();

}

removePlate() {

    if (this.plates.length <= 0) return;

    const plate = this.plates.pop();

    plate.root.remove();

    this.sync();

}

sync() {

    this.plates.forEach((p, i) => {

        p.setTitle(i + 1);

    });

    if (summary && frameManager) {

        refreshSummary();

    }

}
} 
/* =========================================
   FRAME COMPONENT
========================================= */

class Frame {

    constructor(fragment, index) {

        this.root = fragment.querySelector(".frame-card");
this.title = fragment.querySelector(".frame-title h4");

this.materialSelect =
    fragment.querySelector(".frame-material");
 this.colorSelect =
    fragment.querySelector(".frame-color");

this.materials = [];   

this.adapters = [];
this.ledPanels = [];

this.ledSelect =
    fragment.querySelector(".frame-led");

this.adapterGroup =
    fragment.querySelector(".frame-adapter");

this.powerSelect =
    fragment.querySelector(".frame-power");

this.state = {

    model: "basic",

    filament: null,

    ledPanel: null,

    adapter: null,

    weight: 0,

    printTime: 0,

    price: {

        material: 0,

        printing: 0,

        led: 0,

        adapter: 0,

        total: 0

    }

};

this.setTitle(index);

this.loadData();

this.loadMaterials();

this.bindColor();

this.bindLed();
    }

    setTitle(i) {

        this.title.textContent = `Rámeček ${i}`;
    }
    async loadMaterials() {

    this.materials = await loadMaterials();

    const materialTypes = [
        ...new Set(
            this.materials.map(m => m.material)
        )
    ];

    this.materialSelect.innerHTML =
        `<option value="">-- Vyberte materiál --</option>`;

    materialTypes.forEach(type => {

        const option = document.createElement("option");

        option.value = type;
        option.textContent = type;

        this.materialSelect.appendChild(option);

    });

    this.materialSelect.addEventListener("change", () => {

    this.state.filament = null;

    this.updateColors();

    refreshSummary();

});

}
async loadData() {

    const data = await loadModelData();

    this.state.weight = data.weight;

    this.state.printTime = data.printTime;

    this.ledPanels = await loadLedPanels();
this.adapters = await loadAdapters();

    console.log("Frame LED loaded:", this.ledPanels);

    refreshSummary();

}
updateColors() {

    const material =
        this.materialSelect.value;

    this.colorSelect.innerHTML = `

        <option value="">
            -- Vyberte barvu --
        </option>

    `;
this.state.filament = null;

    if (!material) return;

    const colors = this.materials.filter(m =>

        m.material === material
        &&
        m.status !== "unavailable"

    );

    colors.forEach(color => {

        const option =
            document.createElement("option");

        option.value = color.id;

        option.textContent =
            `${color.name} (${color.manufacturer})`;

        this.colorSelect.appendChild(option);

    });

this.colorSelect.selectedIndex = 0;
refreshSummary();
}
bindColor() {

    this.colorSelect.addEventListener("change", () => {

        const filament = this.materials.find(

            m => m.id === this.colorSelect.value

        );

        this.state.filament = filament || null;

        refreshSummary();

    });

}
bindLed() {

    console.log("LED cache:", this.ledPanels);

    this.ledSelect.addEventListener("change", () => {

    const panel = this.ledPanels.find(
        p => p.id === this.ledSelect.value
    ) || null;

    this.state.ledPanel = panel;

    console.log(this.state.ledPanel);

    this.adapterGroup.style.display =
        panel ? "flex" : "none";

    if (!panel) {

    this.powerSelect.value = "no";
    this.state.adapter = null;

}

    refreshSummary();

});

    this.powerSelect.addEventListener("change", () => {

    if (this.powerSelect.value === "yes") {

        this.state.adapter =
            this.adapters.find(a => a.id !== "none") || null;

    } else {

        this.state.adapter = null;

    }

    refreshSummary();

});

}

}

/* =========================================
   FRAME MANAGER
========================================= */

class FrameManager {

    constructor() {

        this.container = document.getElementById("frames-container");
        this.template = document.getElementById("frame-template");

        this.addBtn = document.querySelector(".btn-add-frame");
        this.removeBtn = document.querySelector(".btn-remove-frame");

        this.frames = [];

        this.bind();
    }

    bind() {

        this.addBtn.addEventListener("click", () => this.addFrame());
        this.removeBtn.addEventListener("click", () => this.removeFrame());
    }

    addFrame() {

        const fragment = this.template.content.cloneNode(true);

        const frame = new Frame(fragment, this.frames.length + 1);

        this.frames.push(frame);

        this.container.appendChild(fragment);

        this.sync();

        refreshSummary();
    }

    removeFrame() {

        if (this.frames.length === 0) return;

        const frame = this.frames.pop();

        frame.root.remove();

        this.sync();

        refreshSummary();
    }

    sync() {

        this.frames.forEach((f, i) => {

            f.setTitle(i + 1);

        });
    }
    
}
/* =========================================
   VALIDACE KONFIGURACE
========================================= */

function validateConfiguration() {

    // Musí existovat alespoň jeden modul
    if (
        plateManager.plates.length === 0 &&
        frameManager.frames.length === 0
    ) {

        alert(
            "Přidejte alespoň jednu litofánovou destičku nebo rámeček."
        );

        return false;

    }

    // Kontrola destiček
    for (const plate of plateManager.plates) {

        if (!plate.state.imageUrl) {

            alert(
                `${plate.title.textContent} neobsahuje fotografii.`
            );

            return false;

        }

    }

    // Kontrola rámečků
    for (const frame of frameManager.frames) {

        if (!frame.state.filament) {

            alert(
                `${frame.title.textContent} nemá vybraný materiál a barvu.`
            );

            return false;

        }

    }

    return true;

}
/* =========================================
   INIT
========================================= */

let summary;
let plateManager;
let frameManager;

document.addEventListener("DOMContentLoaded", () => {

    summary = new Summary("summary-container");

    plateManager = new PlateManager();

    frameManager = new FrameManager();

    refreshSummary();

    const cartButton =
    document.querySelector(".cart-button");

cartButton.addEventListener("click", () => {

    if (!validateConfiguration()) return;

    if (plateManager.plates.length > 0) {

        const consent =
            document.getElementById("photoConsent");

        if (!consent.checked) {

            alert(
                "Pro pokračování musíte souhlasit se zpracováním fotografií."
            );

            return;

        }

    }
    console.log("Celkové součty:", totals);
    console.log("Destičky:", plateManager.plates);
    console.log("Rámečky:", frameManager.frames);

    const totals = calculateProject(

        plateManager.plates,

        frameManager.frames

    );

    const cartItem = {

        uid: crypto.randomUUID(),

        type: "helenka",

        productName: "Projekt Helenka",

        quantity: 1,

        unitPrice: totals.price,

        unitWeight: totals.weight,

        unitPrintTime: totals.printTime,

        plates: plateManager.plates.map(plate => ({

            imageName: plate.state.imageName,

            imageUrl: plate.state.imageUrl,

            storagePath: plate.state.storagePath,

            orientation: plate.state.orientation,

            mode: plate.state.mode,

            weight: plate.state.weight,

            printTime: plate.state.printTime,

            price: plate.state.price

        })),

        frames: frameManager.frames.map(frame => ({

            model: frame.state.model,

            filament: frame.state.filament,

            ledPanel: frame.state.ledPanel,

            adapter: frame.state.adapter,

            weight: frame.state.weight,

            printTime: frame.state.printTime,

            price: frame.state.price

        })),

        photoConsent:
            plateManager.plates.length > 0

    };

   let cart = JSON.parse(
    localStorage.getItem("lm-cart")
) || [];

cart.push(cartItem);

localStorage.setItem(
    "lm-cart",
    JSON.stringify(cart)
);

alert("Projekt byl přidán do košíku.");

window.location.href =
    "../../../objednavka/kosik.html?v=2";

});
});
