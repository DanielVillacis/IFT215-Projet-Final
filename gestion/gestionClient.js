const Client = require('../data/Client');
const ItemPanier = require('../data/ItemPanier');
const Panier = require('../data/Panier');

const bCrypt = require('bcrypt');
const saltRounds = 8;

class GestionClient {
  constructor(collectionClient, collectionProduit) {
    this.collectionClient = collectionClient;
    this.collectionProduit = collectionProduit;
  }

  /**
   * Efface un client avec son ID. Irréversible.
   * @param req
   * @param res
   */
  effaceClient(req, res) {
    const id = parseInt(req.params.idClient);
    const c = this.collectionClient.recupereClient(id);
    if (!c) {
      res.status(400).send(`Le client avec l'id ${id} n'a pas été trouvé`);
    } else {
      this.collectionClient.effacerClient(c);
      res.status(200).send(c.public());
    }
  }

  /**
   * Ajoute un client tous les champs devoient être là.
   * @param req
   * @param res
   */
  ajouteClient(req, res) {
    // Il faudrait vérifier que la pays est valide et que l'adresse existe. Une autre fois peut-être
    const duplicata = this.collectionClient.recupereClientParCourriel(req.body.courriel);
    if (duplicata) {
      res.status(400).send('Il y a déjà un client avec cette adresse');
      return;
    }
    const that = this;
    bCrypt.hash(req.body.mdp, saltRounds).then(function(hash) { // La doc dit que c'est plus rapide async
      const c = new Client(-1, req.body.prenom, req.body.nom, parseInt(req.body.age), req.body.adresse, req.body.pays, new Panier(0, []), req.body.courriel, hash, []);
      that.collectionClient.ajouterClient(c);
      res.send(c.public());
    });
  }

  /**
   * Modifie un client. L'ID doit être là, les autres champs du client sont optionels, ceux qui sont là seront mis à jour
   * @param req
   * @param res
   */
  modifierClient(req, res) {
    const id = parseInt(req.params.idClient);
    const c = this.collectionClient.recupereClient(id);
    if (!c) {
      res.status(400).send(`Le client avec l'id ${id} n'a pas été trouvé`);
      return;
    }
    // Il faudrait vérifier que la pays est valide et que l'adresse existe. Une autre fois peut-être
    const cl = {};
    cl.id = c.id;
    cl.prenom = req.body.prenom;
    cl.nom = req.body.nom;
    cl.age = parseInt(req.body.age);
    cl.adresse = req.body.adresse;
    cl.pays = req.body.pays;
    res.send(this.collectionClient.modifierClient(cl).public());
  }

  /**
   * Méthode commune pour retourner un ou des clients dont l'ID est connu.
   * Appelé par /clients retournera alors tous les clients. Peut être filtrée avec des ?clé=valeur
   * Appelé par /clients/id retournera alors le client avec l'id spécifié
   * @param req
   * @param res
   */
  recupereClient(req, res) {
    // S'il y a des éléments dans query, alors c'est une recherche
    if (Object.keys(req.query).length > 0) {
      const prenom = req.query.prenom;
      const nom = req.query.nom;
      const age = parseInt(req.query.age);
      const adresse = req.query.adresse;
      const pays = req.query.pays;

      res.send(this.collectionClient.rechercheClient(prenom, nom, age, adresse, pays));
    } else { // sinon c'est un get avec ID ou sans contrainte
      let idClient = parseInt(req.params.idClient);
      if (!(idClient >= 0)) { // sans la parenthese, !idClient est évalué avant le >= parce que javascript
        idClient = -1;
      }
      const c = this.collectionClient.recupereClient(idClient);
      let retour = [];
      if (c instanceof Array) {
        for (const index in c) {
          retour.push(c[index].public());
        }
      } else {
        retour = c.public();
      }
      res.send(retour);
    }
  }

  /**
   * Retourne un item ou le panier complet d'un client, selon si req.params.idItem est défini
   * @param req
   * @param res
   */
  recuperePanier(req, res) {
    const idClient = parseInt(req.params.idClient);
    let idItem = parseInt(req.params.idItem);
    if (!(idItem >= 0)) { // sans la parenthese, !idItem est évalué avant le >= parce que javascript
      idItem = -1;
    } // Il serait bien de valider que l'item existe réellement dans le panier.
    if (this.collectionClient.recupereClient(idClient)) {
      res.send(this.collectionClient.recuperePanier(idClient, idItem));
    }
  }

  /**
   * Ajoute un item dans le panier d'un client. Le temps que l'item est dans le panier, il est retiré le l'inventaire
   * @param req
   * @param res
   */
  ajoutePanier(req, res) {
    const idClient = parseInt(req.params.idClient);
    if (this.collectionClient.rechercheClient(idClient)) {
      const idProduit = parseInt(req.body.idProduit);
      const quantite = parseInt(req.body.quantite);

      const produit = this.collectionProduit.recupereProduit(idProduit);
      if (!produit) {
        res.status(400).send(`Le produit avec l'id ${idProduit} n'a pas été trouvé.`);
        return;
      }
      if (!(produit.qte_inventaire > quantite)) {
        res.status(400).send(`Il n'y a que ${produit.qte_inventaire} de disponible.  Impossible de réserver ${quantite} exemplaires.`);
        return;
      }
      this.collectionProduit.ajusterQuantite(produit, -quantite);

      let panier;
      const item = this.collectionClient.recupereProduitDansPanier(idClient, idProduit);
      if (item) {
        panier = this.collectionClient.modifierPanier(idClient, item.id, quantite);
      } else {
        const item = new ItemPanier(-1, idProduit, produit.nom, produit.description, produit.prix, quantite);
        panier = this.collectionClient.ajoutePanier(idClient, item);
      }

      res.send(panier);
    } else {
      res.status(400).send(`Le client avec l'id ${idClient} n'a pas été trouvé`);
    }
  }

  /**
   * Modifie un item dans le panier d'un client. Le temps que l'item est dans le panier, il est retiré le l'inventaire
   * @param req
   * @param res
   */
  modifiePanier(req, res) {
    const idClient = parseInt(req.params.idClient);
    if (this.collectionClient.rechercheClient(idClient)) {
      const idItem = parseInt(req.params.idItem);
      const quantite = parseInt(req.body.quantite);

      const item = this.collectionClient.recuperePanier(idClient, idItem);
      if (!item) {
        res.status(400).send(`L'item avec l'id ${idItem} n'a pas été trouvé dans le panier.`);
        return;
      }
      const produit = this.collectionProduit.recupereProduit(item.idProduit);
      if (!(produit.qte_inventaire + quantite >= 0)) {
        res.status(400).send(`Il n'y a que ${produit.qte_inventaire} de disponible.  Impossible de réserver ${quantite} exemplaires.`);
        return;
      }
      this.collectionProduit.ajusterQuantite(produit, -quantite); // Si on fait un plus dans la panier, il faut faire un moins sur l'inventaire.

      const panier = this.collectionClient.modifierPanier(idClient, idItem, quantite);

      res.send(panier);
    } else {
      res.status(400).send(`Le client avec l'id ${idClient} n'a pas été trouvé`);
    }
  }

  retirerPanier(req, res) {
    const idClient = parseInt(req.params.idClient);
    if (this.collectionClient.rechercheClient(idClient)) {
      const idItem = parseInt(req.params.idItem);

      const item = this.collectionClient.recuperePanier(idClient, idItem);
      if (!item) {
        res.status(400).send(`L'item avec l'id ${idItem} n'a pas été trouvé dans le panier.`);
        return;
      }
      const produit = this.collectionProduit.recupereProduit(item.idProduit);
      if (!produit) {
        res.status(400).send(`Le produit ${produit.nom} ne semble plus exister. Comment est-ce possible?`);
        return;
      }
      this.collectionProduit.ajusterQuantite(produit, item.quantite); // Si on fait un plus dans la panier, il faut faire un moins sur l'inventaire.

      const panier = this.collectionClient.retirePanier(idClient, item);

      res.send(panier);
    } else {
      res.status(400).send(`Le client avec l'id ${idClient} n'a pas été trouvé`);
    }
  }
}

module.exports = GestionClient;
