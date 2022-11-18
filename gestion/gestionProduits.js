const Produit = require('../data/Produit');
const Categorie = require('../data/Categorie');

class GestionProduits {
  constructor(collectionProduit, collectionCategorie) {
    this.collectionCategorie = collectionCategorie;
    this.collectionProduit = collectionProduit;
  }

  /**
   * Efface une categorie avec son ID. Irréversible.
   * @param req
   * @param res
   */
  effaceCategorie(req, res) {
    const id = parseInt(req.params.id);
    const c = this.collectionCategorie.recupereCategorie(id);
    if (!c) {
      res.status(400).send(`La catégorie avec l'id ${id} n'a pas été trouvé`);
    } else {
      this.collectionCategorie.effacerCategorie(c);
      res.status(200).send();
    }
  }

  /**
   * Ajoute une catégorie. Tous les champs devoient être là.
   * @param req
   * @param res
   */
  ajouteCategorie(req, res) {
    const c = new Categorie(-1, req.body.nom, req.body.description);
    this.collectionCategorie.ajouterCategorie(c);
    res.send(JSON.stringify(c));
  }

  /**
   * Modifie une catégorie. L'ID doit être là, les autres champs de la catégorie sont optionels,
   * ceux qui sont là seront mis à jour
   * @param req
   * @param res
   */
  modifierCategorie(req, res) {
    const id = parseInt(req.params.idCat);
    const c = this.collectionCategorie.recupereCategorie(id);
    if (!c) {
      res.status(400).send(`La catégorie avec l'id ${id} n'a pas été trouvée`);
      return;
    }
    c.nom = req.body.nom;
    c.description = req.body.description;
    res.send(this.collectionCategorie.modifierCategorie(c));
  }

  /**
   * Méthode commune pour retourner un ou des catégorie.
   * Appelé par /categories retournera alors toutes les categories. Peut être filtrée avec des ?clé=valeur
   * Appelé par /categories/id retournera alors la catégorie avec l'id spécifié
   * @param req
   * @param res
   */
  recupereCategorie(req, res) {
    // S'il y a des éléments dans query, alors c'est une recherche
    if (Object.keys(req.query).length > 0) {
      const nom = req.query.nom;
      const description = req.query.description;

      res.send(this.collectionCategorie.rechercheCategorie(nom, description));
    } else { // sinon c'est un get avec ID ou sans contrainte
      let id = req.params.idCat || -1;
      id = parseInt(id);
      res.send(this.collectionCategorie.recupereCategorie(id));
    }
  }

  /**
   * Efface un produit avec son ID. Irréversible.
   * @param req
   * @param res
   */
  effaceProduit(req, res) {
    const id = parseInt(req.params.idProduit);
    const c = this.collectionProduit.recupereProduit(id);
    if (!c) {
      res.status(400).send(`Le produit avec l'id ${id} n'a pas été trouvé`);
    } else {
      this.collectionProduit.effacerProduit(c);
      res.status(200).send(c);
    }
  }

  /**
   * Ajoute un produit. Tous les champs devoient être là.
   * @param req
   * @param res
   */
  ajouteProduit(req, res) {
    const id = req.body.categorie.id;
    const cat = this.collectionCategorie.recupereCategorie(id);
    if (cat) {
      const c = new Produit(-1, req.body.serial, req.body.nom, req.body.description, req.body.prix, parseInt(req.body.qte_inventaire), cat);
      this.collectionProduit.ajouterProduit(c);
      res.send(c);
    } else {
      res.status(400).send(`La catégorie ${id} n'existe pas`);
    }
  }

  /**
   * Modifie un produit. L'ID doit être là, les autres champs de le produit sont optionels,
   * ceux qui sont là seront mis à jour
   * @param req
   * @param res
   */
  modifierProduit(req, res) {
    const id = parseInt(req.params.idProduit);
    const c = this.collectionProduit.recupereProduit(id);
    if (!c) {
      res.status(400).send(`Le produit avec l'id ${id} n'a pas été trouvé`);
      return;
    }
    c.serial = req.body.serial;
    c.nom = req.body.nom;
    c.description = req.body.description;
    c.prix = req.body.prix;
    c.qte_inventaire = parseInt(req.body.qte_inventaire);
    if (req.body.categorie) {
      const idCat = req.body.categorie.id;
      const cat = this.collectionCategorie.recupereCategorie(idCat);
      if (cat) {
        c.categorie = cat;
      } else {
        res.status(400).send(`La catégorie ${idCat} n'existe pas`);
        return;
      }
    }
    res.send(this.collectionProduit.modifierProduit(c));
  }

  /**
   * Méthode commune pour retourner un ou des produits.
   * Appelé par /produits retournera alors tous les produits. Peut être filtrée avec des ?clé=valeur
   * Appelé par /produits/id retournera alors le produit avec l'id spécifié
   * @param req
   * @param res
   */
  recupereProduit(req, res) {
    // S'il y a des éléments dans query, alors c'est une recherche
    if (Object.keys(req.query).length > 0) {
      const serial = req.query.serial;
      const nom = req.query.nom;
      const description = req.query.description;
      const prix = parseFloat(req.query.prix);
      const qteInventaire = parseInt(req.query.qte_inventaire);
      const categorie = req.query.categorie;

      res.send(this.collectionProduit.rechercheProduit(serial, nom, description, prix, qteInventaire, categorie));
    } else { // sinon c'est un get avec ID ou sans contrainte
      let id = parseInt(req.params.idProduit);
      if (!(id >= 0)) { // sans la parenthese, !id est évalué avant le >= parce que javascript
        id = -1;
      }
      res.send(this.collectionProduit.recupereProduit(id));
    }
  }

  /**
   * Méthode qui donne la liste des produits pour une catégorie donnée
   * @param req
   * @param res
   */
  recupereProduitsCategorie(req, res) {
    const id = parseInt(req.params.idCat);
    const cat = this.collectionCategorie.recupereCategorie(id);

    if (!cat) {
      res.status(400).send(`La catégorie ${id} n'existe pas`);
      return;
    }
    const liste = this.collectionProduit.rechercheProduitCategorie(cat);
    res.send(JSON.stringify(liste));
  }
}

module.exports = GestionProduits;
