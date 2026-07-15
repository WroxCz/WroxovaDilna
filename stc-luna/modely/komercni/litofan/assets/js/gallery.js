// ==========================================
// STC Luna - Galerie
// ==========================================

const images = document.querySelectorAll("[data-gallery] img");

if (images.length) {

    let current = 0;

    // Overlay
    const overlay = document.createElement("div");
    overlay.className = "gallery-overlay";

    overlay.innerHTML = `
        <button class="gallery-close">&times;</button>

        <button class="gallery-prev">&#10094;</button>

        <img class="gallery-image" src="" alt="">

        <button class="gallery-next">&#10095;</button>

        <div class="gallery-counter"></div>
    `;

    document.body.appendChild(overlay);

    const overlayImage = overlay.querySelector(".gallery-image");
    const counter = overlay.querySelector(".gallery-counter");

    function show(index) {

        current = index;

        overlayImage.src = images[current].src;

        counter.textContent = `${current + 1} / ${images.length}`;

        overlay.classList.add("open");

    }

    function close() {

        overlay.classList.remove("open");

    }

    images.forEach((img, index) => {

        img.addEventListener("click", () => {

            show(index);

        });

    });

    overlay.querySelector(".gallery-close")
        .addEventListener("click", close);

    overlay.querySelector(".gallery-prev")
        .addEventListener("click", () => {

            show((current - 1 + images.length) % images.length);

        });

    overlay.querySelector(".gallery-next")
        .addEventListener("click", () => {

            show((current + 1) % images.length);

        });

    overlay.addEventListener("click", (e) => {

        if (e.target === overlay) {

            close();

        }

    });

    document.addEventListener("keydown", (e) => {

        if (!overlay.classList.contains("open")) return;

        if (e.key === "Escape") close();

        if (e.key === "ArrowLeft") {

            show((current - 1 + images.length) % images.length);

        }

        if (e.key === "ArrowRight") {

            show((current + 1) % images.length);

        }

    });

}