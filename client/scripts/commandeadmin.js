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

function commande_to_html(vente, client) {
    return $('<div>test</div>');
}
