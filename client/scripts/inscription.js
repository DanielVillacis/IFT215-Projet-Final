function inscription() {

    let Prenom = document.getElementById("prenom").value;
    let Nom = document.getElementById("nom").value;
    let Age = document.getElementById("age").value;
    let Adresse = document.getElementById("adresse").value;
    let Pays = document.getElementById("pays").value;
    let Courriel = document.getElementById("courriel").value;
    let Mdp = document.getElementById("mot-de-passe").value;
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (isNaN(Age))
        swal("Vérifier le champs Age", "Il doit être numérique", "error");
    if (!(Courriel.match(validRegex)))
        swal("Vérifier le champs Courriel", "il doit sous la forme exemple@test.com", "error");
    if ((Prenom == '') || (Nom == '') || (Age == '') || (Adresse == '') || (Pays == '') || (Mdp == '')) {
        swal("Il manque des champs", "veuillez completer le formulaire", "error");
    }

    $.ajax({
        url: "/clients",
        method:"POST",
        data: {"prenom": Prenom, "nom": Nom, "age": Age, "adresse": Adresse, "pays": Pays, "courriel": Courriel, "mdp": Mdp},
        success: function (result) {
            console.log(result);
            swal("Inscription réussie", "Vous pouvez vous connecter!", "success");
            window.location.replace("#/login");
        }
    });
}

$(function () {


});
