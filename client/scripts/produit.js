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
    item_head = $('<div></div>').addClass('card-header py-3').append('<a class="my-0 fw-normal" href="#/produit_description" id="produit-nom-titre"> <button type="button" class="btn btn-primary position-relative" id="btn-produit-description" onclick="getProduct('+item.id+')" >'+item.nom+'</button></a>' );
    item_detail = $('<div></div>').addClass('list-unstyled mt-3 mb-4')
        .append('<img src="images/produits/'+item.nom+ '.png" style="float:none;margin-left: 25%;" alt="" height=100 width=100/>')
        .append('<li>Qte dispo :' + item.qte_inventaire + '</li>')
        .append('<li>Categorie. : ' + item.categorie.nom + '</li>')
        .append('</br>')
        .append('<small class="small">' + item.description + '</smalll> <h1 class="card-title text-center" style="margin-top: 25px;">$'+item.prix+'</h1> <p class="w-100 display-6 text-center"><button type="button" class="btn btn-primary position-relative" onclick="add_item_ToCart('+item.id+')"><i class="bi bi-cart-plus"></i></button></p>');
    item_body = $('<div></div>').addClass('card-body')
        .append(item_detail);
    item_card.append(item_head).append(item_body);
    return $('<div></div>').addClass('col-md-3').append(item_card);
}

function add_item_ToCart(id_item){
    if (localStorage.getItem('idclient') === 'undefined') {
        swal("Vous devez vous connecter pour accéder au panier!", "veuillez vous connecter!", "error");
        window.location.replace("#/login");
    }
    else {
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

function viderPanier(){
    $.ajax({
        url: "/clients/"+localStorage.getItem('idclient')+"/panier",
        beforeSend: function (xhr){xhr.setRequestHeader('Authorization', "Basic "+localStorage.getItem('tokenclient')) ;},
        success: function (result) {
            for (let i = 0; i < result.items.length; i++) {
                remove_product(i);
            }
            $('#list_items').empty();
        }
    });
}

function add_item(id_item){
    $.ajax({
        url: "/clients/"+localStorage.getItem('idclient')+"/panier/"+id_item,
        method:"PUT",
        data: {"quantite": 1},
        beforeSend: function (xhr){xhr.setRequestHeader('Authorization', "Basic "+localStorage.getItem('tokenclient') );},
        success: function( result ) {
            console.log(result.items);
            console.log('Adding ID : ' + id_item);
            $('#item_counter').text(result.items.length);
            $('#list_items-qte-value-'+id_item+'').text(result.items[id_item].quantite);
            $('#total_value').text(result.valeur.toFixed(2));
            // verifier disponible
        }
    });
}

function remove_item(id_item){
    $.ajax({
        url: "/clients/"+localStorage.getItem('idclient')+"/panier/"+id_item,
        method:"PUT",
        data: {"quantite": -1},
        beforeSend: function (xhr){xhr.setRequestHeader('Authorization', "Basic "+localStorage.getItem('tokenclient') );},
        success: function( result ) {
            console.log('My result');
            console.log(result.items[id_item].quantite);
            if(result.items[id_item].quantite == 0){
                console.log('Have to remove you');
                remove_product(id_item);
                id_item -1;
            }
            else{
                $('#list_items-qte-value-'+id_item+'').text(result.items[id_item].quantite);
                $('#total_value').text(result.valeur.toFixed(2));
                $('#item_counter').text(result.items.length);
            }
        }
    });
}

function remove_product(id_item){
    $.ajax({
        url: "/clients/"+localStorage.getItem('idclient')+"/panier/"+id_item,
        method:"DELETE",
        data: {},
        beforeSend: function (xhr){xhr.setRequestHeader('Authorization', "Basic "+localStorage.getItem('tokenclient') );},
        success: function( result ) {
            $('#item_counter').text(result.items.length);
            $('#total_value').text(result.valeur.toFixed(2));
            $('#tr-'+id_item+'').remove();
        }
    });
}


function itemPanier_to_html(item) {
    let pTotal = item.prix * item.quantite;
    let prixTotal = pTotal.toFixed(2);
    item_panier = $('<tr id="tr-'+item.id+'"></tr>')
        .append('<td>' + item.nomProduit + '<img src="images/produits/'+item.nomProduit+ '.png" alt="" height=100 width=100/>' +'</td>')
        .append('<td>' + item.descriptionProduit + '</td>')
        .append('<td>' + '<div id="list_items-qte">' + '<div id="list_items-qte-value-'+item.id+'" style="align-self: center; margin-left: 10%;" >' + item.quantite + '</div>' + '<div id="list_items-qte-btn">' +'<button class="btn btn-primary position-relative" type="button" id="qte-button" onclick="add_item('+item.id+')">ˆ</button>' + '<button type="button" class="btn btn-primary position-relative" id="qte-button" onclick="remove_item('+item.id+')" value="ˇ"/>ˇ</button>' + '</div>' + '</div>' + '</td>')
        .append('<td>' +'$'+item.prix + '</td>')
        .append('<td>'+ '<button type="button" class="btn btn-primary position-relative" id="btn-qte-remove-product" onclick="remove_product('+item.id+')" >X</button>' + '</td>');
    return $(item_panier);
}

function commander(){
    $.ajax({
        url: "/clients/"+localStorage.getItem('idclient')+"/commander",
        method:"POST",
        data: {},
        beforeSend: function (xhr){xhr.setRequestHeader('Authorization', "Basic "+localStorage.getItem('tokenclient') );},
        success: function( result ) {
            console.log(result);
            $('#checkout-items').text(result.items.length);
            $('#checkout-total').text(result.valeur.toFixed(2));
        }
    });
}

$(function () {
});
