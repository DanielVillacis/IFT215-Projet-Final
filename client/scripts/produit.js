function chargerproduit() {
    $.ajax({
        url: "/produits",
        success: function (result) {
            console.log(result);
            $.each(result, function (key, value) {
                item = item_to_html(value);
                $('#list_items').append(item);
            });
        }
    });
}

function item_to_html(item) {
    item_card = $('<div></div>').addClass('card mb-4 rounded-3 shadow-sm');
    item_head = $('<div></div>').addClass('card-header py-3').append('<h4 class="my-0 fw-normal">' + item.nom + '</h4>');
    item_detail = $('<div></div>').addClass('list-unstyled mt-3 mb-4')
        .append('<li>Qte dispo :' + item.qte_inventaire + '</li>')
        .append('<li>Categorie. : ' + item.categorie.nom + '</li>')
        .append('</br>')
        .append('<small class="small">' + item.description + '</smalll> <p class="w-100 display-6 text-center"><button type="button" class="btn btn-primary position-relative" onclick="add_item('+item.id+')"><i class="bi bi-cart-plus"></i></button></p>');
    item_body = $('<div></div>').addClass('card-body').append('<h1 class="card-title text-center"> $' + item.prix +  '</h1>').append(item_detail);
    item_card.append(item_head).append(item_body);
    return $('<div></div>').addClass('col-md-3').append(item_card);
}

function add_item(id_item){
    $.ajax({
        url: "/clients/"+localStorage.getItem('idclient')+"/panier",
        method:"POST",
        data: {"idProduit": id_item, "quantite": 1},
        beforeSend: function (xhr){xhr.setRequestHeader('Authorization', "Basic "+localStorage.getItem('tokenclient'));},
        success: function( result ) {
            $('#item_counter').text(result.items.length);
        }
    });
}

function chargerpanier() {
    if (localStorage.getItem('idclient') === 'undefined') {
        swal("Vous devez vous connecter pour accéder au panier!", "veuillez vous connecter!", "error");
        window.location.replace("#/login");
    }
    else {
        $.ajax({
            url: "/clients/"+localStorage.getItem('idclient')+"/panier",
            beforeSend: function (xhr){xhr.setRequestHeader('Authorization', "Basic "+localStorage.getItem('tokenclient')) ;},
            success: function( result ) {
                console.log(result);console.log(result.items);
                $.each(result.items, function (key, value) {
                    item = itemPanier_to_html(value);
                    $('#list_items').append(item);
                });
                grand_total = $('<td></td><td></td><td style=text-align:right;"><strong>Grand total : </strong></td><td><strong>' + result.valeur +' </strong></td>')
                $('#grand_total').append(grand_total);
            }
        });
    }
}
function itemPanier_to_html(item) {
    let pTotal = item.prix * item.quantite;
    let prixTotal = pTotal.toFixed(2);
    item_panier = $('<tr></tr>')
        .append('<td>' + item.nomProduit + '</td>')
        .append('<td>' + item.prix + '</td>')
        .append('<td>' + item.quantite + '</td>')
        .append('<td>'+ prixTotal + '</td>');

    return $(item_panier);
}

$(function () {
});