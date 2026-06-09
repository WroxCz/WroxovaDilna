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
        folder: "Benchy Wikinger2",
        path: "./testovaci-modely/Benchy/Benchy Wikinger2/model.html"
    }
    ,
    {
        name: "test převisu",
        category: "testovaci-modely",
        subcategory: "Mosty",
        folder: "test-previsu",
        path: "./testovaci-modely/Mosty/test-previsu/model.html"
    }
,
    {
        name: "Benchy + test převisu",
        category: "testovaci-modely",
        subcategory: "Mosty",
        folder: "benchy-test-previsu",
        path: "./testovaci-modely/Mosty/benchy-test-previsu/model.html"
    }
    ,
    {
        name: "Clearance Tolerance Test",
        category: "testovaci-modely",
        subcategory: "Tolerance",
        folder: "Clearance Tolerance Test",
        path: "./testovaci-modely/Tolerance/Clearance Tolerance Test/model.html"
    }
        ,
    {
        name: "Print in Place Tolerance Test",
        category: "testovaci-modely",
        subcategory: "Tolerance",
        folder: "Print in Place Tolerance Test",
        path: "./testovaci-modely/Tolerance/Print in Place Tolerance Test/model.html"
    }
            ,
    {
        name: "Tolerance gauge  Fidget toy",
        category: "testovaci-modely",
        subcategory: "Tolerance",
        folder: "Tolerance gauge  Fidget toy",
        path: "./testovaci-modely/Tolerance/Tolerance gauge  Fidget toy/model.html"
    }
             ,
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    {
        name: "Frozen Elsa funko POP",
        category: "ukazkovy-tisk",
        subcategory: "figurky funky pop",
        folder: "funky pop",
        path: "./ukazkovy-tisk/figurky/funky pop/Frozen Elsa/model.html"
    }
    ,
    {
        name: "Jack Skellington",
        category: "ukazkovy-tisk",
        subcategory: "figurky funky pop",
        folder: "funky pop",
        path: "./ukazkovy-tisk/figurky/funky pop/Jack Skellington/model.html"
    }
        ,
    {
        name: "Goku Super",
        category: "ukazkovy-tisk",
        subcategory: "figurky funky pop",
        folder: "funky pop",
        path: "./ukazkovy-tisk/figurky/funky pop/Goku Super Saiyajin/model.html"
    }
            ,
    {
        name: "GOKU SSJ-4",
        category: "ukazkovy-tisk",
        subcategory: "figurky funky pop",
        folder: "funky pop",
        path: "./ukazkovy-tisk/figurky/funky pop/GOKU SSJ-4/model.html"
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