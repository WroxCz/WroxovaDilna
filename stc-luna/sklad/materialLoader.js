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

export async function loadMaterials() {

    const data = await Promise.all(

        materialFiles.map(file =>

            fetch(`/stc-luna/sklad/data/${file}`)
                .then(r => r.json())

        )

    );

    return data.flat();

}