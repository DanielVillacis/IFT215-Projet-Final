// affiche le formulaire de commande et le bouton de paiement avec l'appel ajax pour la création de la commande
// appel a la fonction chargerPanier.js et function itemPanier_to_html(item)


function chargercommande() {
    if (localStorage.getItem('idclient') === 'undefined') {
        swal("Vous devez vous connecter pour accéder au panier!", "veuillez vous connecter!", "error");
        window.location.replace("#/login");
    }
    else {
        $.ajax({
            url: "/clients/"+localStorage.getItem('idclient')+"/panier",
            beforeSend: function (xhr){xhr.setRequestHeader('Authorization', "Basic "+localStorage.getItem('tokenclient')) ;},
            success: function( result ) {
                console.log(result);
                console.log(result.items);
                $.each(result.items, function (key, value) {
                    item = checkout_to_HMTL(value);
                    $('#checkout-items').append(item);
                });
                grand_total = $('<td></td><td></td><td colspan="2" style=text-align:right;"><strong>Total : </strong></td><td><strong id="total_value">' +'$'+result.valeur.toFixed(2) +' </strong></td>')
                $('#checkout-total').append(grand_total);
            }
        });
    }
}


function checkout_to_HMTL(item) {
    let pTotal = item.prix * item.quantite;
    let prixTotal = pTotal.toFixed(2);
    item_panier = $('<tr id="tr-'+item.id+'"></tr>')
        .append('<td>' + item.nomProduit + '<img src="images/produits/'+item.nomProduit+ '.png" alt="" height=60 width=70/>' +'</td>')
        .append('<td>' + '<div id="list_items-qte">' + '<div id="list_items-qte-value-'+item.id+'" style="align-self: center; margin-left: 10%;" >' + item.quantite + '</div>' + '<div id="list_items-qte-btn">' + '</div>' + '</td>')
        .append('<td>' +'$'+item.prix + '</td>')
    return $(item_panier);
}


function confirmercommande() {
    // confirmerCommande();
    swal("Votre commande a été confirmée!", "Merci pour votre achat!", "success");
    window.location.replace("./#/accueil");
    window.location.reload();
}

function confirmerInformation() {
    let COURRIEL_CLIENT = document.getElementById("client_courriel").value;
    let COURRIEL_MDP = document.getElementById("client_mdp").value;
    if (COURRIEL_CLIENT) {
        verifierInformation(COURRIEL_CLIENT,COURRIEL_MDP);
    }
}

function verifierInformation(COURRIEL_CLIENT,COURRIEL_MDP) {
    // vérifie si le client existe dans la base de données
    console.log('Vérifier les informations');
    $.ajax({
        url: "/clients/"+COURRIEL_CLIENT,
        beforeSend: function (xhr){xhr.setRequestHeader('Authorization', "Basic "+btoa(COURRIEL_CLIENT+":"+COURRIEL_MDP)) ;},
        success: function( result ) {
            console.log(result);
            localStorage.setItem('idclient', result.id);
            localStorage.setItem('tokenclient', btoa(COURRIEL_CLIENT+":"+COURRIEL_MDP));
            window.location.replace("#/produits");
            window.location.reload();
            console.log('Client existe');
        },
        error: function (result) {
            console.log(result);
            swal("SVP Entrer le courriel pour ce compte", "error");
        }
    });
}

$(function () {
});

