let quantiteToAdd = 1;

function chargerproduit_description (id_item) {
    const currentProduct = JSON.parse(localStorage.getItem('currentProduct'));
    console.log(currentProduct);
    $('#nom-produit').text(currentProduct.nom);
    $('#section-produit-img').append('<img src="images/produits/'+currentProduct.nom+'.png" alt="Image de produit" height=300 width=300 style="margin-left: 20%" />')
    $('#description-produit').text(currentProduct.description);
    $('#produit-prix').text('$' + currentProduct.prix);
    $('#produit-boutons').append('<div id="list_items-qte">' + '<div id="qte-value" style="align-self: center; margin-left: 10%;" >' + quantiteToAdd + '</div>' + '<div id="list_items-qte-btn">' +'<button class="btn btn-primary position-relative" type="button" id="qte-button" onclick="changeQte(1)">ˆ</button>' + '<button type="button" class="btn btn-primary position-relative" id="qte-button" onclick="changeQte(-1)" value="ˇ"/>ˇ</button>' + '</div>' + '</div>');
    $('#produit-boutons').append('<button type="button" class="btn btn-primary position-relative" style="margin-left: 20px" onclick="add_item_ToCart('+currentProduct.id+')" >Ajouter</button>');
}

function getProduct(id_item) {
    $.ajax({
        url: "/produits",
        success: function (result) {
            console.log(result);
            localStorage.setItem("currentProduct", JSON.stringify(result[id_item]));
        }
    });
}

function changeQte(qte){

    if(qte == -1 && quantiteToAdd == 1){
        return;
    }
    else if(qte > 0)
    {
        quantiteToAdd++;
    }else{
        quantiteToAdd--;
    }
    $('#qte-value').text(quantiteToAdd);
}

function add_item_ToCart(id_item){
    $.ajax({
        url: "/clients/"+localStorage.getItem('idclient')+"/panier",
        method:"POST",
        data: {"idProduit": id_item, "quantite": quantiteToAdd},
        beforeSend: function (xhr){xhr.setRequestHeader('Authorization', "Basic "+localStorage.getItem('tokenclient'));},
        success: function( result ) {
            $('#item_counter').text(result.items.length);
            quantiteToAdd=1;
        }
    });
}






