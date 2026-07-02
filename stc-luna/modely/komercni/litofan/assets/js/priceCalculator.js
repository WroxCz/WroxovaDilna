// ==========================================
// HELENKA - Price Calculator
// ==========================================

"use strict";



// ==========================================
// Nastavení kalkulace
// ==========================================

// Cena provozu tiskárny za minutu
const MACHINE_COST_PER_MINUTE = 0.5;

// Síťový adaptér
const POWER_ADAPTER_COST = 0;

function calculateMaterialAndPrinting(item) {

    const filament = item.state.filament;

    if (!filament) {

        item.state.price.material = 0;
        item.state.price.printing = 0;
        item.state.price.total = 0;

        return;

    }

    const pricePerGram =

        filament.price /

        (filament.weight * 1000);

    item.state.price.material = Math.round(

        item.state.weight *

        pricePerGram *

        filament.multiplier

    );

    item.state.price.printing = Math.round(

item.state.printTime *

filament.timeFactor *

MACHINE_COST_PER_MINUTE

    );

    item.state.price.total =

        item.state.price.material +

        item.state.price.printing;

}


/* =========================================
   LITOFÁNOVÁ DESTIČKA
========================================= */

export function calculatePlate(plate) {

    calculateMaterialAndPrinting(plate);

    return plate;

}
/* =========================================
   RÁMEČEK
========================================= */

export function calculateFrame(frame) {

    calculateMaterialAndPrinting(frame);

frame.state.price.led =

    frame.state.ledPanel?.price || 0;

frame.state.price.adapter =
    frame.state.adapter
        ? POWER_ADAPTER_COST
        : 0;

    frame.state.price.total +=

        frame.state.price.led +

        frame.state.price.adapter;

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