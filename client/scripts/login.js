function verifielogin(COURRIEL_CLIENT,COURRIEL_MDP) {

    $.ajax({
        url: "/connexion",
        method:"POST",
        data: {"courriel": COURRIEL_CLIENT, "mdp": COURRIEL_MDP},
        success: function (result) {
            console.log(result);
            ID_CLIENT = result.idClient;
            TOKEN_CLIENT = result.token;
            ROLE_CLIENT = result.role;
            localStorage.setItem('idclient',ID_CLIENT);
            localStorage.setItem('tokenclient',TOKEN_CLIENT);
            localStorage.setItem('roleclient',ROLE_CLIENT);
            if (ROLE_CLIENT == 'admin'){
                loginheader = $('<div id="login"></div>')
                    .append('Bonjour '+'admin'+' '+'<img src="images/logout.png" onclick="deconnexion()" style="cursor: pointer;" class="padding "alt="Se déconnecter" width="70" title="Se déconnecter"/></a><a href="#/panier" class=""><button type="button" class="btn btn-primary position-relative"><i class="bi bi-cart-plus"></i><span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="item_counter"></span></button></a>')
                $('#login').replaceWith(loginheader);
                swal("Connexion réussi!", "Vous pouvez faire la gestion des commandes!", "success");
                window.location.replace("#/commandeadmin");
            }
            else{
                $.ajax({
                    url: "/clients/"+ID_CLIENT,
                        beforeSend: function (xhr){xhr.setRequestHeader('Authorization', "Basic "+TOKEN_CLIENT );},
                    success: function( result ) {
                        console.log("le prénom");
                        PRENOM_CLIENT = result.prenom;
                        localStorage.setItem('prenom',PRENOM_CLIENT);
                        console.log(localStorage.getItem('prenom'));
                        loginheader = $('<div id="login"></div>')
                            .append('Bonjour '+localStorage.getItem('prenom')+' '+'<img src="images/logout.png" onclick="deconnexion()" style="cursor: pointer;" class="padding "alt="Se déconnecter" width="70" title="Se déconnecter"/></a><a href="#/panier" class=""><button type="button" class="btn btn-primary position-relative"><i class="bi bi-cart-plus"></i><span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="item_counter"></span></button></a>')
                        $('#login').replaceWith(loginheader);


                        swal("Connexion réussi!", "Vous pouvez ajouter des items à votre panier!", "success");
                        window.location.replace("#/produit");

                    }
                });
            }
        },
        error: function (result) {
            swal("Mot de passe/courriel incorrect!", "veuillez essayer à nouveau!", "error");
        }
    });
}

function chargerlogin() {

    try {
    let COURRIEL_CLIENT = document.getElementById("client_courriel").value;
    let COURRIEL_MDP = document.getElementById("client_mdp").value;
    if (COURRIEL_CLIENT)
        verifielogin(COURRIEL_CLIENT,COURRIEL_MDP);
    }
    catch(err){
        window.location.href = "#/login";
    }
}

function deconnexion() {
    console.log(localStorage.getItem('idclient'));

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

    localStorage.setItem('idclient',undefined);
    localStorage.setItem('tokenclient',undefined);
    console.log(localStorage.getItem('idclient'));
    window.location.href = "#/login"
}

$(function () {
    console.log(localStorage.getItem('idclient'));

    if ((localStorage.getItem('idclient') === 'undefined')) {
        loginheader = $('<div id="login"></div>')
            .append('<img src="images/login.png" onclick="deconnexion()" style="cursor: pointer;" class="padding "alt="Se connecter" width="70" title="Se connecter"/></a><a href="#/panier" class=""><button type="button" class="btn btn-primary position-relative"><i class="bi bi-cart-plus"></i><span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="item_counter"></span></button></a>');
        $('#login').replaceWith(loginheader);
    }
    else {
        loginheader = $('<div id="login"></div>')

            .append('Bonjour '+localStorage.getItem('prenom')+' '+'<img src="images/logout.png" onclick="deconnexion()" style="cursor: pointer;" class="padding "alt="Se déconnecter" width="70" title="Se déconnecter"/></a><a href="#/panier" class=""><button type="button" class="btn btn-primary position-relative"><i class="bi bi-cart-plus"></i><span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="item_counter"></span></button></a>');
        $('#login').replaceWith(loginheader);
    }
});
