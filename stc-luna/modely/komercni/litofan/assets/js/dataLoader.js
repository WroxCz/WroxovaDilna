// ==========================================
// HELENKA - Data Loader
// ==========================================

"use strict";

let modelData = null;

export async function loadModelData() {

    if (modelData) {

        return modelData;

    }

    const response = await fetch("./assets/json/data.json");

    modelData = await response.json();

    return modelData;

}