function chargercommandeadmin() {
    if (localStorage.getItem('roleclient') !== 'admin'){
        console.log('ici');
        swal("Vous n'avez pas accès à cette page!", "veuillez vous connecter comme Admin!", "error");
        window.location.replace('#/produit');
    }

    $.ajax({
        url: '/ventes',
        beforeSend: function (xhr){xhr.setRequestHeader('Authorization', "Basic "+localStorage.getItem('tokenclient'));},
        success: function (result) {
            console.table(result);
            $.each(result, function (key, value) {
                $.ajax({
                    url: '/clients/' + value.idClient,
                    method: 'GET',
                    beforeSend: function (xhr){xhr.setRequestHeader('Authorization', "Basic "+localStorage.getItem('tokenclient'));},
                    success: function (result) {
                        client = result;
                        console.log(value);
                        vente = commande_to_html(value, client);
                        $('#commande_clients').append(vente);
                    },
                });
            });
        },
    });
}

// fonction pour afficher les commandes de chaque client dans la page commandeadmin
function commande_to_html(vente, client) {
    // afficher le numero de commande, le id du client, l'adresse de livraison, la date de la commande et apres une liste des produits commandes avec leur id et leur quantite selon les donnees du fichier ventes.json

    // afficher le numero de commande
    var commande = $('<div class="commande" id="commande_'+vente.id+'"></div>');
    var numero_commande = $('<div class="numero_commande"></div>');
    numero_commande.text('Commande #'+vente.id);
    commande.append(numero_commande);

    // afficher l'id du client
    var id_client = $('<div class="id_client"></div>');
    id_client.text('Client #'+vente.idClient);
    commande.append(id_client);

    // afficher l'adresse de livraison
    var adresse_livraison = $('<div class="adresse_livraison"></div>');
    adresse_livraison.text('Adresse de livraison: '+client.adresse);
    commande.append(adresse_livraison);

    // afficher la date de la commande
    var date_commande = $('<div class="date_commande"></div>');
    date_commande.text('Date de la commande: '+vente.date);
    commande.append(date_commande);

    // afficher la liste des produits commandes avec leur image, leur id et leur quantite
    var liste_produits = $('<div class="liste_produits"></div>');
    $.each(vente.produits, function (key, value) {
        var produit = $('<div class="produit"></div>');
        var id_produit = $('<div class="id_produit"></div>');
        id_produit.text('Produit #'+value.id);
        produit.append(id_produit);
        var quantite = $('<div class="quantite"></div>');
        quantite.text('Quantité: '+value.quantite);
        produit.append(quantite);
        liste_produits.append(produit);
    });
    commande.append(liste_produits);

    // afficher un bouton au coté droit de chaque commande pour confirmer la livraison
    var confirmer_livraison = $('<div class="confirmer_livraison"></div>');
    var confirmer_livraison_button = $('<button class="confirmer_livraison_button" onclick="confimerlivraison('+vente.id+')">Expédier</button>');

    confirmer_livraison.append(confirmer_livraison_button);
    commande.append(confirmer_livraison);

    return commande;
    // return $('<div>test</div>');
}

function confimerlivraison(idVente) {
    // changer le status de la commmande dans le fichier ventes.json de "reçu" à "préparé" seulement si on est connecté comme admin
    // if (localStorage.getItem('roleclient') !== 'admin'){
    //     console.log('ici');
    //     swal("Vous n'avez pas accès à cette page!", "veuillez vous connecter comme Admin!", "error");
    //     window.location.replace('#/produit');
    // }
    // let newStatus = 'préparé';
    // $.ajax({
    //     url: '/ventes/'+idVente,
    //     method: 'PUT',
    //     data: {"idVente": idVente, "status": newStatus},
    //     beforeSend: function (xhr){xhr.setRequestHeader('Authorization', "Basic "+localStorage.getItem('tokenclient'));},
    //     success: function (result) {
    //         console.log(result);
    //         swal("Commande expédiée!", "La commande a été expédiée avec succès!", "success");
    //         window.location.replace('#/commandeadmin');
    //     },
    // });

    console.log('confirmer livraison');
    console.log(idVente);
    $('#commande_'+idVente+'').remove();
    let newStatus = 'prepare';
    $.ajax({
        url: "/ventes/"+idVente,
        method: 'PUT',
        data: {"idVente": idVente, "status": newStatus},
        beforeSend: function (xhr){xhr.setRequestHeader('Authorization', "Basic "+localStorage.getItem('tokenclient'));},
        success: function (result) {
            console.log('La vente est effectuée');
            //result.status = newStatus;
            // Il faut etre admin, mais commment faire?
        }
    });
    swal("Livraison confirmée!", "La commande a été livrée avec succès!", "success");
    window.location.replace('#/commandeadmin');
}
