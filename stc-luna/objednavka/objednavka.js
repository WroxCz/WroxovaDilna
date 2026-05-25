document
.getElementById("orderForm")
.addEventListener("submit", function(e){

    e.preventDefault();

    alert("Objednávka odeslána do Forge World.");
});
const params = new URLSearchParams(window.location.search);

const modelName = params.get("model");

if(modelName){

    document.querySelector("#modelInput").value = modelName;
}