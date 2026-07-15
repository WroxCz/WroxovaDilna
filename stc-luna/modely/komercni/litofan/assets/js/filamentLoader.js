// ==========================================
// HELENKA - Filament Loader
// ==========================================

"use strict";

const cache = {};

const BASE =
    window.location.hostname === "wroxcz.github.io"
        ? "/WroxovaDilna/stc-luna/sklad/data/"
        : "/stc-luna/sklad/data/";

// ==========================================
// Načtení typu filamentu
// ==========================================

export async function loadFilamentType(source) {

    if (cache[source]) {
        return cache[source];
    }

    const response = await fetch(`${BASE}${source}`);

    cache[source] = await response.json();

    console.log("Načten filament:", source, cache[source]);

    return cache[source];

}