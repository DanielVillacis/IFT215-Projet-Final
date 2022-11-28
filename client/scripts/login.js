

function verifielogin(COURRIEL_CLIENT,COURRIEL_MDP) {

    $.ajax({
        url: "/connexion",
        method:"POST",
        data: {"courriel": COURRIEL_CLIENT, "mdp": COURRIEL_MDP},
        success: function (result) {
            console.log(result);
            ID_CLIENT = result.idClient;
            TOKEN_CLIENT = result.token;
            sessionStorage.setItem('idclient',ID_CLIENT);
            sessionStorage.setItem('tokenclient',TOKEN_CLIENT);
            const mode = sessionStorage.getItem('idclient');


            connexion = $('<a href="#/logout"><img src="images/logout.png"  class="padding "alt="Se connecter" width="70"/></a><a href="#/panier" class=""><button type="button" class="btn btn-primary position-relative"><i class="bi bi-cart-plus"></i><span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="item_counter"></span></button></a>')


            $('#login').replaceWith(connexion);







            window.location.href = "#/produit";
        },
        error: function (result) {
            alert("Mauvaise combinaison");
        }
    });
}

function chargerlogin() {

    let COURRIEL_CLIENT = document.getElementById("client_courriel").value;
    let COURRIEL_MDP = document.getElementById("client_mdp").value;
    if (COURRIEL_CLIENT)
        verifielogin(COURRIEL_CLIENT,COURRIEL_MDP);
}


$(function () {
});