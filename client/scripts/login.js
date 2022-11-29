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
            $.ajax({
                url: "/clients/"+ID_CLIENT,
                    beforeSend: function (xhr){xhr.setRequestHeader('Authorization', "Basic "+TOKEN_CLIENT );},
                success: function( result ) {
                    console.log(result.prenom);
                    PRENOM_CLIENT = result.prenom;
                    sessionStorage.setItem('prenom',PRENOM_CLIENT);
                }
            });
            loginheader = $('<div id="login"></div>')

                .append('Bonjour '+sessionStorage.getItem('prenom')+' '+'<img src="images/logout.png" onclick="deconnexion()" style="cursor: pointer;" class="padding "alt="Se déconnecter" width="70" title="Se déconnecter"/></a><a href="#/panier" class=""><button type="button" class="btn btn-primary position-relative"><i class="bi bi-cart-plus"></i><span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="item_counter"></span></button></a>')
            $('#login').replaceWith(loginheader);

            window.location.replace("#/produit");
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

function deconnexion() {
    console.log(sessionStorage.getItem('idclient'));

    $.ajax({
        url: "/connexion/"+1,
        method:"DELETE",
        success: function (result) {
            console.log(result);

        },
    });
    loginheader = $('<div id="login"></div>')
        .append('<img src="images/login.png" onclick="chargerlogin()" style="cursor: pointer;" class="padding "alt="Se connecter" width="70"/></a><a href="#/panier" class=""><button type="button" class="btn btn-primary position-relative"><i class="bi bi-cart-plus"></i><span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="item_counter"></span></button></a>');
    $('#login').replaceWith(loginheader);

    sessionStorage.setItem('idclient',undefined);
    sessionStorage.setItem('tokenclient',undefined);
    console.log(sessionStorage.getItem('idclient'));
    window.location.href = "#/login"
}


$(function () {
    console.log(sessionStorage.getItem('idclient'));

    if (sessionStorage.getItem('idclient') != undefined) {
        loginheader = $('<div id="login"></div>')
            .append('<img src="images/logout.png" onclick="deconnexion()" style="cursor: pointer;" class="padding "alt="Se connecter" width="70" title="Se déconnecter"/></a><a href="#/panier" class=""><button type="button" class="btn btn-primary position-relative"><i class="bi bi-cart-plus"></i><span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="item_counter"></span></button></a>');
        $('#login').replaceWith(loginheader);
    }
    else {
        loginheader = $('<div id="login"></div>')
            .append('<img src="images/login.png" onclick="chargerlogin()" style="cursor: pointer;" class="padding "alt="Se connecter" width="70" title="Se connecter"/></a><a href="#/panier" class=""><button type="button" class="btn btn-primary position-relative"><i class="bi bi-cart-plus"></i><span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="item_counter"></span></button></a>');
        $('#login').replaceWith(loginheader);
    }
});
