class ItemPanier {
  constructor (id, idObjet, nomObjet, descriptionObjet, prix, quantite) {
    this.id = id;
    this.idProduit = idObjet;
    this.nomProduit = nomObjet;
    this.descriptionProduit = descriptionObjet;
    this.prix = prix;
    this.quantite = quantite;
  }
}

module.exports = ItemPanier;
