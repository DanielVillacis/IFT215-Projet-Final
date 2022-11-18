const fs = require('fs');

const Produit = require('../data/Produit');
const path = require('path');

class CollectionProduit {
  constructor() {
    this.liste_produits = [];
    this.CHEMIN_PAR_DEFAUT = path.join(__dirname, '/../data/repo/produits.json');
  }

  /**
   * Charge les produits depuis le fichier
   * @param fichier Chemin complet vers un fichier, optionnel
   */
  chargerProduit(fichier) {
    try {
      this.liste_produits.length = 0;

      const chemin = fichier || this.CHEMIN_PAR_DEFAUT;
      console.log(`Chargement des produits depuis ${chemin}`);

      fs.readFile(chemin, { flag: 'r' }, (err, data) => {
        if (err && err.errno === -4058) {
          console.log('Le fichier n\'existe pas, la liste des produits sera vide');
        } else if (data.length > 0) {
          const liste = JSON.parse(data);
          for (const elem in liste) {
            const c = liste[elem];
            this.liste_produits.push(new Produit(c.id, c.serial, c.nom, c.description, c.prix, c.qte_inventaire, c.categorie));
          }
        }
      });
    } catch (err) {
      console.log('Erreur dans le chargement des produits');
    }
  }

  /**
   * Fonction interne pour trouver le prochain ID pour un nouveau produit. Si la liste de produits est vide l'id est zéro,
   * sinon c'est le dernier +1
   * @returns {number} prochain ID à utiliser
   */
  recupereProchainID() {
    let id = 0;
    if (this.liste_produits.length > 0) {
      id = this.liste_produits.slice(-1)[0].id;
      id += 1;
    }
    return id;
  }

  /**
   * Retourne les produits
   * @param id Optionnel, pour avoir un seul produits au lieu de toute la liste
   * @returns {*[]|*}
   */
  recupereProduit(id) {
    if (id > -1) {
      return this.liste_produits.find(x => x.id === id);
    } else {
      return this.liste_produits;
    }
  }

  /**
   * Filtre la liste des produits et retournes ceux qui correspondent
   * @param serial Optionel
   * @param nom Optionel
   * @param description Optionel
   * @param prix Optionel
   * @param qteInventaire Optionel
   * @param categorie Optionel
   * @returns {*[]}
   */
  rechercheProduit(serial, nom, description, prix, qteInventaire, categorie) {
    let listeLocale = [...this.liste_produits];
    if (serial) {
      listeLocale = listeLocale.filter(function (elem) {
        return elem.serial === serial;
      });
    }
    if (nom) {
      listeLocale = listeLocale.filter(function (elem) {
        return elem.nom === nom;
      });
    }
    if (description) {
      listeLocale = listeLocale.filter(function (elem) {
        return elem.description.includes(description);
      });
    }
    if (prix) {
      listeLocale = listeLocale.filter(function (elem) {
        return elem.prix === prix;
      });
    }
    if (qteInventaire) {
      listeLocale = listeLocale.filter(function (elem) {
        return elem.qte_inventaire === qteInventaire;
      });
    }
    if (categorie && categorie.id) {
      listeLocale = listeLocale.filter(function (elem) {
        return elem.categorie.id === categorie.id;
      });
    }
    return listeLocale;
  }

  /**
   * Méthode rapide pour rechercher les produits d'une catégorie.
   * @param cat
   * @returns {*[]}
   */
  rechercheProduitCategorie(cat) {
    return this.rechercheProduit(null, null, null, null, null, cat);
  }

  /**
   * Fonction interne. Sauvegarde les fichiers sur le disque
   * @param fichier Optionnel chemin vers un fichier de sauvegarde
   */
  sauvegarder(fichier) {
    const chemin = fichier || this.CHEMIN_PAR_DEFAUT;
    const data = JSON.stringify(this.liste_produits, null, 4);
    try {
      fs.writeFile(chemin, data, { flag: 'w+' }, (err) => {
        if (err) {
          throw err;
        }
        console.log(`Produits enregistrés dans le fichier ${chemin}`);
      });
    } catch (err) {
      console.log('Erreur dans l\'enregistrement du fichier');
      console.log(err.message);
    }
  }

  /**
   * Ajoute un produit
   * @param produit instance de la classe Produit
   */
  ajouterProduit(produit) {
    if (produit.id === -1) {
      produit.id = this.recupereProchainID();
    }
    this.liste_produits.push(produit);
    this.sauvegarder();
  }

  /**
   * Efface un produit
   * @param produit instance de Produit
   */
  effacerProduit(produit) {
    this.liste_produits.splice(this.liste_produits.findIndex(item => item.id === produit.id), 1);
    this.sauvegarder();
  }

  /**
   * Modifie un produit
   * @param nouveauProduit Instance de Produit. L'ID doit être le même que sur le disque.
   *                          Chacun des autres champs peut être nul s'il n'est pas modifié
   */
  modifierProduit(nouveauProduit) {
    const objIndex = this.getObjIndex(nouveauProduit.id);
    if (objIndex > -1) { // S'il n'est pas trouvé l'index sera -1
      if (nouveauProduit.serial) {
        this.liste_produits[objIndex].serial = nouveauProduit.serial;
      }
      if (nouveauProduit.nom) {
        this.liste_produits[objIndex].nom = nouveauProduit.nom;
      }
      if (nouveauProduit.description) {
        this.liste_produits[objIndex].description = nouveauProduit.description;
      }
      if (nouveauProduit.prix) {
        this.liste_produits[objIndex].prix = nouveauProduit.prix;
      }
      if (nouveauProduit.qte_inventaire) {
        this.liste_produits[objIndex].qte_inventaire = nouveauProduit.qte_inventaire;
      }
      if (nouveauProduit.categorie) {
        this.liste_produits[objIndex].categorie = nouveauProduit.categorie;
      }
    }
    this.sauvegarder();
    return this.liste_produits[objIndex];
  }

  getObjIndex(idProduit) {
    return this.liste_produits.findIndex(obj => obj.id === idProduit);
  }

  /**
   * Ajoute la quantité à l'inventaire. Pour un retrait, mettre un nombre négatif
   * @param produit
   * @param quantite
   */
  ajusterQuantite(produit, quantite) {
    const index = this.getObjIndex(produit.id);
    this.liste_produits[index].qte_inventaire += quantite;
    this.sauvegarder();
  }
}

module.exports = CollectionProduit;
