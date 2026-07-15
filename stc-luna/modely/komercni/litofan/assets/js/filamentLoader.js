// ==========================================
// HELENKA - Filament Loader
// ==========================================

"use strict";

const cache = {};

// ==========================================
// Načtení typu filamentu
// ==========================================

export async function loadFilamentType(source) {

    if (cache[source]) {

        return cache[source];

    }

    const response =
        await fetch(`/stc-luna/sklad/data/${source}`)

    cache[source] =
        await response.json();

console.log("Načten filament:", source, cache[source]);

    return cache[source];

}