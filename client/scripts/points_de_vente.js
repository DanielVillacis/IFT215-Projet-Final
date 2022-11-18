
function genererMagasin(data){
    let locaux = document.getElementById('pdv-grille');
    let internationaux = document.getElementById('pdv-flex');

    let innerHTML = ""
    for(let indice in data.commerces_locaux){
        let element = data.commerces_locaux[indice]
        innerHTML += "<article class=\"pdv-item\">" +
                "<h1>" + element.ville + "</h1>" +
                "<address>"+ element.adresse + "</address>" +
                "<h2>Heures d'ouverture: </h2>" +
                "<ul>";
        for (let h in element.horaire){
            let jour = element.horaire[h];
            innerHTML += "<li>" + jour + "</li>";
        }

        innerHTML += "</ul></article>";

    }

    locaux.innerHTML = innerHTML;

    for(let indice in data.commerces_internationaux){
        let element = data.commerces_internationaux[indice];
        let article = document.createElement('article');
        article.classList.add('pdv-item');

        let h1 = document.createElement('h1');
        h1.innerText = element.ville;
        article.appendChild(h1);

        let adresse = document.createElement('address');
        adresse.innerText = element.adresse;
        article.appendChild(adresse);

        let h2 = document.createElement('h2');
        h2.innerText = "Heures d'ouverture:";
        article.appendChild(h2);

        let ul = document.createElement('ul');
        for (let h in element.horaire){
            let jour = element.horaire[h];
            let li = document.createElement('li');
            li.innerText = jour;
            ul.appendChild(li);
        }
        article.appendChild(ul)

        internationaux.appendChild(article)
    }

}

function chargerpoints_de_vente (){
    fetch('./commerces')
        .then(commerces => {return commerces.json()})
        .then(data => genererMagasin(data) )
}