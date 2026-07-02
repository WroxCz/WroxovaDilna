// ==========================================
// STC Luna - Material Loader
// ==========================================

const materialFiles = [

    "petg-cf.json",
    "petg-matte.json",
    "petg-special.json",
    "petg-standard.json",

    "pla-matte.json",
    "pla-plus.json",
    "pla-silk.json",
    "pla-standard.json",
    "pla-wood.json"

];


const BASE =
    window.location.hostname === "wroxcz.github.io"
        ? "/WroxovaDilna/stc-luna/sklad/data/"
        : "/stc-luna/sklad/data/";

export async function loadMaterials() {

    const data = await Promise.all(

        materialFiles.map(file =>

            fetch(`${BASE}${file}`)
                .then(r => r.json())

        )

    );

    return data.flat();

}