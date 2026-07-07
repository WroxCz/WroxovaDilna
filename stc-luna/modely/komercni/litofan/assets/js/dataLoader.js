// ==========================================
// HELENKA - Data Loader
// ==========================================

"use strict";

let modelData = null;

let plateData = null;

// ==========================================
// Manifest projektu
// ==========================================

export async function loadModelData() {

    if (modelData) {

        return modelData;

    }

    const response =
        await fetch("./assets/json/data.json");

    modelData =
        await response.json();

    return modelData;

}

// ==========================================
// Data litofánové destičky
// ==========================================

export async function loadPlateData() {

    if (plateData) {

        return plateData;

    }

    const response =
        await fetch("./assets/json/plate-data.json");

    plateData =
        await response.json();

    return plateData;

}

// ==========================================
// Vyhledání skupiny podle ID
// ==========================================

export async function getGroup(groupId) {

    const model =
        await loadModelData();

    return model.groups.find(

        g => g.id === groupId

    );

}
// ==========================================
// Načtení modulu podle source
// ==========================================

const moduleCache = {};

export async function loadModule(source) {

    if (moduleCache[source]) {

        return moduleCache[source];

    }

    const response =
        await fetch(`./assets/json/${source}`);

    moduleCache[source] =
        await response.json();

    return moduleCache[source];

}