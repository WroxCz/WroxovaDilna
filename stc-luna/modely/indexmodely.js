const modely = [

/*
    {
        name: "Spiral Vase Rose",
        category: "dekorace",
        subcategory: "Květiny",
        folder: "spiral-vase-rose"
    },

    {
        name: "Rose 01",
        category: "dekorace",
        subcategory: "Květiny",
        folder: "rose-01"
    },
*/

    {
        name: "Tulipán se stonkem",
        category: "dekorace",
        subcategory: "Květiny",
        folder: "tulip-with-stem",
        path: "./komercni/dekorace/kvetiny/tulip-with-stem/model.html"
    }
    ,



     {
        name: "Piraten Benchy",
        category: "testovaci-modely",
        subcategory: "Benchy",
        folder: "piraten-benchy",
        path: "./testovaci-modely/Benchy/Piraten Benchy/model.html"
    }
    ,
    {
        name: "Benchy Wikinger2",
        category: "testovaci-modely",
        subcategory: "Benchy",
        folder: "piraten-benchy",
        path: "./testovaci-modely/Benchy/Benchy Wikinger2/model.html"
    }


];

function vytvorModel(model) {

    const container = document.getElementById(model.category + "-list");

    let sub = document.getElementById("sub-" + model.subcategory);

    if (!sub) {

        const subTitle = document.createElement("h3");

        subTitle.textContent = model.subcategory;

        subTitle.id = "sub-" + model.subcategory;

        container.appendChild(subTitle);

        sub = document.createElement("div");

        sub.id = "models-" + model.subcategory;

        container.appendChild(sub);
    }

    const link = document.createElement("a");

    link.href = model.path;

    link.textContent = model.name;

    link.className = "model-link";

    document
        .getElementById("models-" + model.subcategory)
        .appendChild(link);
}

modely.forEach(model => {

    vytvorModel(model);

});