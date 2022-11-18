class Vente {
  constructor (id, idClient, montant, produits, status, date) {
    this.id = id;
    this.idClient = idClient;
    this.montant = montant;
    this.produits = produits;
    this.status = status;
    this.date = date;
  }
}

module.exports = Vente;
