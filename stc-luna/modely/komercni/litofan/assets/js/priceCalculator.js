// ==========================================
// HELENKA - Price Calculator
// ==========================================

"use strict";
// ==========================================
// Nastavení kalkulace
// ==========================================

// Cena tisku za minutu
const PRINT_PRICE_PER_MINUTE = 0;

// LED panel Basic
const LED_BASIC_PRICE = 0;

// Síťový adaptér
const POWER_ADAPTER_PRICE = 0;
/* =========================================
   LITOFÁNOVÁ DESTIČKA
========================================= */

export function calculatePlate(plate) {

    // zatím nic

    return plate;

}

/* =========================================
   RÁMEČEK
========================================= */

export function calculateFrame(frame) {

    frame.state.price.total = 0;

    return frame;

}

/* =========================================
   CELÝ PROJEKT
========================================= */

export function calculateProject(plates, frames) {

    let totalPrice = 0;

    let totalWeight = 0;

    let totalPrintTime = 0;

    plates.forEach(plate => {

        calculatePlate(plate);

        totalPrice += plate.state.price.total;

        totalWeight += plate.state.weight;

        totalPrintTime += plate.state.printTime;

    });

    frames.forEach(frame => {

        calculateFrame(frame);

        totalPrice += frame.state.price.total;

        totalWeight += frame.state.weight;

        totalPrintTime += frame.state.printTime;

    });

    return {

        price: totalPrice,

        weight: totalWeight,

        printTime: totalPrintTime

    };

}