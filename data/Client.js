class Client {
  constructor(id, prenom, nom, age, adresse, pays, panier, courriel, mdp, historique) {
    this.id = id;
    this.prenom = prenom;
    this.nom = nom;
    this.age = age;
    this.adresse = adresse;
    this.pays = pays;

    this.courriel = courriel;
    this.mdp = mdp;

    this.panier = panier;
    this.historique = historique;
  }

  public() {
    return {
      id: this.id,
      prenom: this.prenom,
      nom: this.nom,
      age: this.age,
      adresse: this.adresse,
      pays: this.pays,
      panier: this.panier,
      courriel: this.courriel,
      historique: this.historique
    };
  }
}

module.exports = Client;
