function inscription() {

    let Prenom = document.getElementById("prenom").value;
    let Nom = document.getElementById("nom").value;
    let Age = document.getElementById("age").value;
    let Adresse = document.getElementById("adresse").value;
    let Pays = document.getElementById("pays").value;
    let Courriel = document.getElementById("courriel").value;
    let Mdp = document.getElementById("mot-de-passe").value;

    $.ajax({
        url: "/clients",
        method:"POST",
        data: {"prenom": Prenom, "nom": Nom, "age": Age, "adresse": Adresse, "pays": Pays, "courriel": Courriel, "mdp": Mdp},
        success: function (result) {
            console.log(result);
        }
    });
}

$(function () {


});
