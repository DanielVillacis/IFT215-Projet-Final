const Vente = require('../data/Vente');

class GestionVentes {
  constructor(collectionClient, collectionVente, collectionProduit) {
    this.collectionVente = collectionVente;
    this.collectionClient = collectionClient;
    this.collectionProduit = collectionProduit;

    this.statusPossibles = {
      recue: 'reçue',
      prepare: 'préparée',
      en_route: 'en route',
      livree: 'livrée'
    };
  }

  /**
   * Efface une vente avec son ID. Irréversible.
   * @param req
   * @param res
   */
  annulerVente(req, res) {
    const id = parseInt(req.params.idVente);
    const vente = this.collectionVente.recupereVentes(id);
    if (vente) {
      if (vente.status === this.statusPossibles.recue) {
        this.collectionVente.effacerVente(vente);
        for (const i in vente.produits) {
          const itemPanier = vente.produits[i];
          this.collectionProduit.ajusterQuantite({ id: itemPanier.idProduit }, itemPanier.quantite);
        }
        res.status(200).send(vente);
      } else {
        res.status(400).send('Il est trop tard pour annuler la vente');
      }
    } else {
      res.status(400).send(`La vente avec l'id ${id} n'a pas été trouvée`);
    }
  }

  /**
   * Ajoute une vente. Tous les champs doivent être là, sauf le status.
   * @param req
   * @param res
   */
  ajouterVente(req, res) {
    const idClient = req.body.idClient;
    const client = this.collectionClient.recupereClient(idClient);
    if (client) {
      if (client.panier.valeur > 0) {
        const vente = new Vente(-1, idClient, client.panier.valeur, client.panier.items, this.statusPossibles.recue, new Date());
        this.collectionClient.acheterPanier(client, vente);
        this.collectionVente.ajouterVente(vente);
        res.send(vente);
      } else {
        res.status(400).send(`Le client ${idClient} n'a pas de panier actif`);
      }
    } else {
      res.status(400).send(`Le client ${idClient} n'a pas été trouvé`);
    }
  }

  /**
   * Modifie le status d'une vente. L'ID doit être là de même que le nouveau status
   * @param req
   * @param res
   */
  modifierStatus(req, res) {
    const id = parseInt(req.params.idVente);
    const status = req.body.status;
    if (!(status in this.statusPossibles)) {
      res.status(400).send(`La status ${status} n'est pas valide`);
      return;
    }
    const vente = this.collectionVente.recupereVentes(id);
    if (!vente) {
      res.status(400).send(`La vente avec l'id ${id} n'a pas été trouvée`);
      return;
    }
    this.collectionClient.modifierStatusHistorique(vente, status);
    res.send(this.collectionVente.modifierVente(vente, status));
  }

  /**
   * Méthode commune pour retourner une ou des ventes.
   * Appelé par /ventes retournera alors toutes les ventes. Peut être filtrée avec des ?clé=valeur
   * Appelé par /ventes/id retournera alors la vente avec l'id spécifié
   * @param req
   * @param res
   */
  recupererVente(req, res) {
    // S'il y a des éléments dans query, alors c'est une recherche
    if (Object.keys(req.query).length > 0) {
      const status = req.query.status;
      const depuis = req.query.depuis;
      const idClient = parseInt(req.query.client);

      res.send(this.collectionVente.rechercheVentes(idClient, status, Date.parse(depuis)));
    } else { // sinon c'est un get avec ID ou sans contrainte
      let id = parseInt(req.params.idVente);
      if (!(id >= 0)) { // sans la parenthese, !id est évalué avant le >= parce que javascript
        id = -1;
      }
      res.send(this.collectionVente.recupereVentes(id));
    }
  }

  /**
   * Retourne la liste des status possibles
   * @param req
   * @param res
   */
  recupererStatus(req, res) {
    res.send(this.statusPossibles);
  }
}

module.exports = GestionVentes;
