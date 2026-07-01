// ==========================================
// HELENKA – litofan.js (clean rebuild)
// ==========================================
"use strict";

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
            orientation: "portrait",
            mode: "unlit"
        };

        this.setTitle(index);
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
            });
        });

        this.modeInputs.forEach(r => {
            r.addEventListener("change", () => {
                if (!r.checked) return;

                this.state.mode = r.value;
                this.render();
            });
        });
    }

    /* -------------------------
       IMAGE LOAD
    ------------------------- */
    loadImage(e) {
        const file = e.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);

        this.img.src = url;
        this.img.style.display = "block";
        this.uploadText.style.display = "none";

        const image = new Image();

        image.onload = () => {
            this.state.image = image;
            this.render();
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
        const plate = new Plate(fragment, this.plates.length + 1);

        this.plates.push(plate);
        this.container.appendChild(fragment);

        this.sync(); // 👈 SEM (po přidání)
    }

    removePlate() {
        if (this.plates.length <= 0) return;

        const plate = this.plates.pop();
        plate.root.remove();

        this.sync(); // 👈 SEM (po smazání)
    }

    sync() {
        this.plates.forEach((p, i) => {
            p.setTitle(i + 1);
        });
    }
}

/* =========================================
   INIT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    new PlateManager();
});