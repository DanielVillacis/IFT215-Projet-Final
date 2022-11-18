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
        url: "/clients/"+1+"/panier",
        method:"POST",
        data: {"idProduit": id_item, "quantite": 1},
        beforeSend: function (xhr){xhr.setRequestHeader('Authorization', "Basic "+'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MSwicm9sZSI6ImNsaWVudCIsImlhdCI6MTYzNjc1MjI1MywiZXhwIjoxODM2NzUyMjUzfQ.qMcKC0NeuVseNSeGtyaxUvadutNAfzxlhL5LYPsRB8k' );},
        success: function( result ) {
            $('#item_counter').text(result.items.length);
        }
    });
}

function chargerpanier() {
    $.ajax({
        url: "/clients/"+1+"/panier",
        beforeSend: function (xhr){xhr.setRequestHeader('Authorization', "Basic "+'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MSwicm9sZSI6ImNsaWVudCIsImlhdCI6MTYzNjc1MjI1MywiZXhwIjoxODM2NzUyMjUzfQ.qMcKC0NeuVseNSeGtyaxUvadutNAfzxlhL5LYPsRB8k' );},
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