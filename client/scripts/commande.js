// affiche le formulaire de commande et le bouton de paiement avec l'appel ajax pour la création de la commande
// appel a la fonction chargerPanier.js et function itemPanier_to_html(item)
function chargerCommande() {
    console.log('Chargement de la commande');
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
                    item = itemPanier_to_html(value);
                    $('#list_items').append(item);
                });
                grand_total = $('<td></td><td></td><td colspan="2" style=text-align:right;"><strong> Total : </strong></td><td><strong id="total_value">' +'$'+result.valeur.toFixed(2) +' </strong></td>')
                $('#grand_total').append(grand_total);
            }
        });
    }
}

function itemPanier_to_html(item) {
    let pTotal = item.prix * item.quantite;
    let prixTotal = pTotal.toFixed(2);
    item_panier = $('<tr id="tr-'+item.id+'"></tr>')
        .append('<td>' + item.nomProduit + '<img src="images/produits/'+item.nomProduit+ '.png" alt="" height=100 width=100/>' +'</td>')
        .append('<td>' + item.descriptionProduit + '</td>')
        .append('<td>' + '<div id="list_items-qte">' + '<div id="list_items-qte-value-'+item.idProduit+'" style="align-self: center; margin-left: 10%;" >' + item.quantite + '</div>' + '<div id="list_items-qte-btn">' +'<button class="btn btn-primary position-relative" type="button" id="qte-button" onclick="add_item('+item.id+')">ˆ</button>' + '<button type="button" class="btn btn-primary position-relative" id="qte-button" onclick="remove_item('+item.id+')" value="ˇ"/>ˇ</button>' + '</div>' + '</div>' + '</td>')
        .append('<td>' +'$'+item.prix + '</td>')
        .append('<td>'+ '<button type="button" class="btn btn-primary position-relative" id="btn-qte-remove-product" onclick="remove_product('+item.id+')" >X</button>' + '</td>');
    return $(item_panier);
}

function confirmerCommande() {
    console.log('Confirmer la commande');
    swal("Votre commande a été confirmée!", "Merci pour votre achat!", "success");
    // return to the home page after 3 seconds, and reload the page
    setTimeout(function () {
        window.location.replace("#/produits");
        window.location.reload();   
    }, 3000);
}


