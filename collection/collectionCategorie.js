const fs = require('fs');

const Categorie = require('../data/Categorie');
const path = require('path');

/**
 * Charge les categories depuis le fichier
 * @param fichier Chemin complet vers un fichier, optionnel
 */

class CollectionCategorie {
  constructor() {
    this.liste_categories = [];
    this.CHEMIN_PAR_DEFAUT = path.join(__dirname, '/../data/repo/catagories.json');
  }

  chargerCategorie(fichier) {
    try {
      this.liste_categories.length = 0;

      const chemin = fichier || this.CHEMIN_PAR_DEFAUT;
      console.log(`Chargement des catégories depuis ${chemin}`);

      fs.readFile(chemin, { flag: 'r' }, (err, data) => {
        if (err && err.errno === -4058) {
          console.log('Le fichier n\'existe pas, la liste des catégories sera vide');
        } else if (data.length > 0) {
          const liste = JSON.parse(data);
          for (const elem in liste) {
            const c = liste[elem];
            this.liste_categories.push(new Categorie(c.id, c.nom, c.description));
          }
        }
      });
    } catch (err) {
      console.log('Erreur dans le chargement des catégories');
    }
  }

  /**
   * Fonction interne pour trouver le prochain ID pour une nouvelle catégorie. Si la liste de catégories est vide l'id est zéro,
   * sinon c'est le dernier +1
   * @returns {number} prochain ID à utiliser
   */
  recupereProchainID() {
    let id = 0;
    if (this.liste_categories.length > 0) {
      id = this.liste_categories.slice(-1)[0].id;
      id += 1;
    }
    return id;
  }

  /**
   * Retourne les catégories
   * @param id Optionnel, pour avoir une seule catégorie au lieu de toute la liste
   * @returns {*[]|*}
   */
  recupereCategorie(id) {
    if (id > -1) {
      return this.liste_categories.find(x => x.id === id);
    } else {
      return this.liste_categories;
    }
  }

  /**
   * Fait une recherche sur les catégories et retournes celles qui correspondent
   * @param nom nom à trouver ou null pour ne pas le considérer
   * @param description age à trouver ou null pour ne pas le considérer
   * @returns {*[]} Liste des catégories qui correspondent
   */
  rechercheCategorie(nom, description) {
    let listeLocale = [...this.liste_categories];
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
    return listeLocale;
  }

  /**
   * Fonction interne. Sauvegarde les fichiers sur le disque
   * @param fichier Optionnel chemin vers un fichier de sauvegarde
   */
  sauvegarder(fichier) {
    const chemin = fichier || this.CHEMIN_PAR_DEFAUT;
    const data = JSON.stringify(this.liste_categories, null, 4);
    try {
      fs.writeFile(chemin, data, { flag: 'w+' }, (err) => {
        if (err) {
          throw err;
        }
        console.log(`Catégories enregistrés dans le fichier ${chemin}`);
      });
    } catch (err) {
      console.log('Erreur dans l\'enregistrement du fichier');
      console.log(err.message);
    }
  }

  /**
   * Ajoute une catégorie
   * @param categorie instance de la classe Catégorie
   */
  ajouterCategorie(categorie) {
    if (categorie.id === -1) {
      categorie.id = this.recupereProchainID();
    }
    this.liste_categories.push(categorie);
    this.sauvegarder();
  }

  /**
   * Efface une catégorie
   * @param categorie instance de client
   */
  effacerCategorie(categorie) {
    this.liste_categories.splice(this.liste_categories.findIndex(item => item.id === categorie.id), 1);
    this.sauvegarder();
  }

  /**
   * Modifie une catégorie
   * @param nouvelleCategorie Instance de catégorie. L'ID doit être le même que sur le disque.
   *                          Chacun des autres champs peut être nul s'il n'est pas modifié
   */
  modifierCategorie(nouvelleCategorie) {
    const objIndex = this.liste_categories.findIndex(obj => obj.id === nouvelleCategorie.id);
    if (objIndex > -1) { // S'il n'est pas trouvé l'index sera -1
      if (nouvelleCategorie.nom) {
        this.liste_categories[objIndex].nom = nouvelleCategorie.nom;
      }
      if (nouvelleCategorie.description) {
        this.liste_categories[objIndex].description = nouvelleCategorie.description;
      }
    }
    this.sauvegarder();
    return this.liste_categories[objIndex];
  }
}

module.exports = CollectionCategorie;
