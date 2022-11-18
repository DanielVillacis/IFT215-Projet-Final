const fs = require('fs');

const Vente = require('../data/Vente');
const path = require('path');

class CollectionVente {
  constructor() {
    this.liste_vente = [];
    this.CHEMIN_PAR_DEFAUT = path.join(__dirname, '/../data/repo/ventes.json');
  }

  /**
   * Charge les ventes depuis le fichier
   * @param fichier Chemin complet vers un fichier, optionnel
   */
  chargerVentes(fichier) {
    try {
      this.liste_vente.length = 0;

      const chemin = fichier || this.CHEMIN_PAR_DEFAUT;
      console.log(`Chargement des ventes depuis ${chemin}`);

      fs.readFile(chemin, { flag: 'r' }, (err, data) => {
        if (err && err.errno === -4058) {
          console.log('Le fichier n\'existe pas, la liste des ventes sera vide');
        } else if (data.length > 0) {
          const liste = JSON.parse(data);
          for (const elem in liste) {
            const c = liste[elem];
            this.liste_vente.push(new Vente(c.id, c.idClient, c.montant, c.produits, c.status, new Date(c.date)));
          }
        }
      });
    } catch (err) {
      console.log('Erreur dans le chargement des ventes');
    }
  }

  /**
   * Fonction interne pour trouver le prochain ID pour une nouvelle vente. Si la liste des ventes est vide l'id est zéro,
   * sinon c'est le dernier +1
   * @returns {number} prochain ID à utiliser
   */
  recupereProchainID() {
    let id = 0;
    if (this.liste_vente.length > 0) {
      id = this.liste_vente.slice(-1)[0].id;
      id += 1;
    }
    return id;
  }

  /**
   * Retourne les ventes
   * @param id Optionnel, pour avoir un seul produits au lieu de toute la liste
   * @returns {*[]|*}
   */
  recupereVentes(id) {
    if (id > -1) {
      return this.liste_vente.find(x => x.id === id);
    } else {
      return this.liste_vente;
    }
  }

  /**
   * Filtre la liste des ventes et retournes celles qui correspondent
   * @param idClient Optionel
   * @param status Optionel
   * @param depuis Optionel. Instance de Date
   * @returns {*[]}
   */
  rechercheVentes(idClient, status, depuis) {
    let listeLocale = [...this.liste_vente];
    if (idClient >= 0) {
      listeLocale = listeLocale.filter(function (elem) {
        return elem.idClient === idClient;
      });
    }
    if (status) {
      listeLocale = listeLocale.filter(function (elem) {
        return elem.status === status;
      });
    }
    if (depuis) {
      listeLocale = listeLocale.filter(function (elem) {
        return elem.date > depuis;
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
    const data = JSON.stringify(this.liste_vente, null, 4);
    try {
      fs.writeFile(chemin, data, { flag: 'w+' }, (err) => {
        if (err) {
          throw err;
        }
        console.log(`Ventes enregistrées dans le fichier ${chemin}`);
      });
    } catch (err) {
      console.log('Erreur dans l\'enregistrement du fichier');
      console.log(err.message);
    }
  }

  /**
   * Ajoute une vente
   * @param vente instance de la classe Vente
   */
  ajouterVente(vente) {
    if (vente.id === -1) {
      vente.id = this.recupereProchainID();
    }
    this.liste_vente.push(vente);
    this.sauvegarder();
  }

  /**
   * Efface une vente
   * @param vente instance de Vente
   */
  effacerVente(vente) {
    this.liste_vente.splice(this.liste_vente.findIndex(item => item.id === vente.id), 1);
    this.sauvegarder();
  }

  /**
   * Modifie une vente
   * @param vente
   * @param nouveauStatus
   */
  modifierVente(vente, nouveauStatus) {
    const objIndex = this.getObjIndex(vente.id);
    if (objIndex > -1) { // S'il n'est pas trouvé l'index sera -1
      this.liste_vente[objIndex].status = nouveauStatus;
    }
    this.sauvegarder();
    return this.liste_vente[objIndex];
  }

  getObjIndex(idVente) {
    return this.liste_vente.findIndex(obj => obj.id === idVente);
  }
}

module.exports = CollectionVente;
