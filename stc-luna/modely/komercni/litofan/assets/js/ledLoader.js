"use strict";

let ledPanels = null;

export async function loadLedPanels() {

    if (ledPanels) {

        return ledPanels;

    }

    const response = await fetch("./assets/json/led-panels.json");

    ledPanels = await response.json();

    return ledPanels;

}