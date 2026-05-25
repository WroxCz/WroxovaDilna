function loadHTML(path, targetId, callback) {

    fetch(path)

    .then(response => response.text())

    .then(data => {

        document.getElementById(targetId).innerHTML = data;

        if (callback) callback();

    });

}

loadHTML(
            "dekorace/dekorace.html",
            "dekorace-list",

            () => {

                loadHTML(
                    "dekorace/kvetiny/kvetiny.html",
                    "kvetiny-list"
                );

            }
        );


loadHTML(
    "testovaci-modely/testovaci-modely.html",
    "testovaci-modely-list"
);

loadHTML(
    "tematicke-modely/tematicke-modely.html",
    "tematicke-modely-list",

    () => {

        loadHTML(
            "tematicke-modely/fantasy/fantasy.html",
            "fantasy-list",

            () => {
                loadHTML(
                    "tematicke-modely/fantasy/funko-naruto/funko.html",
                    "funko-list",

                    () => {

                        loadHTML(
                            "tematicke-modely/fantasy/funko-naruto/funko.html",
                            "funko-list"
                        );
                    }
                );    
                loadHTML(
                    "tematicke-modely/fantasy/naruto/naruto.html",
                    "naruto-list",

                    () => {

                        loadHTML(
                            "tematicke-modely/fantasy/naruto/sakura/sakura.html",
                            "sakura-list"
                        );
                        loadHTML(
                            "tematicke-modely/fantasy/naruto/temari/temari.html",
                            "temari-list"
                        );
                    }
                );
                
            }
        );

    }
);