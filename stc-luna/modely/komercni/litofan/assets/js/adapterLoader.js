"use strict";

let adapters = null;

export async function loadAdapters() {

    if (adapters) {
        return adapters;
    }

    const response = await fetch("./assets/json/adapters.json");

    adapters = await response.json();

    return adapters;

}