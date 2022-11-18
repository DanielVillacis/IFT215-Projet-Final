const fs = require('fs');

const Client = require('../data/Client');
const Panier = require('../data/Panier');
const path = require('path');

/**
 * Charge les clients depuis le fichier
 * @param fichier Chemin complet vers un fichier, optionnel
 */

class CollectionClient {
  constructor() {
    this.liste_clients = [];
    this.CHEMIN_PAR_DEFAUT = path.join(__dirname, '/../data/repo/clients.json');
  }

  chargerClients(fichier) {
    try {
      this.liste_clients.length = 0;

      const chemin = fichier || this.CHEMIN_PAR_DEFAUT;
      console.log(`Chargement des clients depuis ${chemin}`);

      fs.readFile(chemin, { flag: 'r' }, (err, data) => {
        if (err && err.errno === -4058) {
          console.log('Le fichier n\'existe pas, la liste des clients sera vide');
        } else if (data.length > 0) {
          const liste = JSON.parse(data);
          for (const elem in liste) {
            const c = liste[elem];
            this.liste_clients.push(new Client(c.id, c.prenom, c.nom, c.age, c.adresse, c.pays, c.panier, c.courriel, c.mdp, c.historique));
          }
        }
      });
    } catch (err) {
      console.log('Erreur dans le chargement des clients');
    }
  }

  /**
   * Fonction interne pour trouver le prochain ID pour un nouveau client. Si la liste de client est vide l'id est zéro,
   * sinon c'est le dernier +1
   * @returns {number} prochain ID à utiliser
   */
  recupereProchainID() {
    let id = 1; // l'id 0 est réservé pour l'admin
    if (this.liste_clients.length > 0) {
      id = this.liste_clients.slice(-1)[0].id;
      id += 1;
    }
    return id;
  }

  /**
   * Fonction interne pour trouver le prochain ID pour un item dans le panier d'un client. Si la liste de produit est vide l'id est zéro,
   * sinon c'est le dernier +1
   * @param idClient
   * @returns {number} prochain ID à utiliser
   */
  recupereProchainIDItem(idClient) {
    let id = 0;
    const index = this.getClientIndex(idClient);
    if (this.liste_clients[index].panier.items.length > 0) {
      id = this.liste_clients[index].panier.items.slice(-1)[0].id;
      id += 1;
    }
    return id;
  }

  /**
     * Retourne les clients
     * @param id Optionnel, pour avoir un seul client au lieu de toute la liste
     * @returns {*[]|*}
     */
  recupereClient(id) {
    if (id > -1) {
      return this.liste_clients.find(x => x.id === id);
    } else {
      return this.liste_clients;
    }
  }

  /**
   * Retrouve un client en utilisant son adresse courriel.
   * @param courriel
   * @returns {null|*} null si le client n'est pas trouvé, le client sinon
   */
  recupereClientParCourriel(courriel) {
    if (courriel) {
      return this.liste_clients.find(x => x.courriel === courriel);
    }
    return null;
  }

  /**
   * Fait une recherche sur les clients et retournes ceux qui correspondent
   * @param prenom prenom à trouver ou null pour ne pas le considérer
   * @param nom nom à trouver ou null pour ne pas le considérer
   * @param age age à trouver ou null pour ne pas le considérer
   * @param adresse adresse à trouver ou null pour ne pas le considérer
   * @param pays pays à trouver ou null pour ne pas le considérer
   * @returns {*[]} Liste des clients qui correspondent
   */
  rechercheClient(prenom, nom, age, adresse, pays) {
    let listeLocale = [...this.liste_clients];
    if (prenom) { // sera vrai si prenom n'est pas: null, undefined, NaN, empty string (""), 0, false
      listeLocale = listeLocale.filter(function (elem) {
        return elem.prenom === prenom;
      });
    }
    if (nom) {
      listeLocale = listeLocale.filter(function (elem) {
        return elem.nom === nom;
      });
    }
    if (age) {
      listeLocale = listeLocale.filter(function (elem) {
        return elem.age === age;
      });
    }
    if (adresse) {
      listeLocale = listeLocale.filter(function (elem) {
        return elem.adresse === adresse;
      });
    }
    if (pays) {
      listeLocale = listeLocale.filter(function (elem) {
        return elem.pays === pays;
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
    const data = JSON.stringify(this.liste_clients, null, 4);
    try {
      fs.writeFile(chemin, data, { flag: 'w+' }, (err) => {
        if (err) {
          throw err;
        }
        console.log(`Clients enregistrés dans le fichier ${chemin}`);
      });
    } catch (err) {
      console.log('Erreur dans l\'enregistrement du fichier');
      console.log(err.message);
    }
  }

  /**
   * Ajoute un client
   * @param client instance de la classe Client
   */
  ajouterClient(client) {
    if (client.id === -1) {
      client.id = this.recupereProchainID();
    }
    this.liste_clients.push(client);
    this.sauvegarder();
  }

  /**
   * Efface un client
   * @param client instance de client
   */
  effacerClient(client) {
    this.liste_clients.splice(this.liste_clients.findIndex(item => item.id === client.id), 1);
    this.sauvegarder();
  }

  /**
   * Modifie un client
   * @param nouveauClient Instance de client. L'ID doit être le même que sur le disque.
   *                      Chacun des autres champs peut être nul s'il n'est pas modifié
   */
  modifierClient(nouveauClient) {
    const objIndex = this.getClientIndex(nouveauClient.id);
    if (objIndex > -1) { // S'il n'est pas trouvé l'index sera -1
      if (nouveauClient.prenom) {
        this.liste_clients[objIndex].prenom = nouveauClient.prenom;
      }
      if (nouveauClient.nom) {
        this.liste_clients[objIndex].nom = nouveauClient.nom;
      }
      if (nouveauClient.age) {
        this.liste_clients[objIndex].age = nouveauClient.age;
      }
      if (nouveauClient.adresse) {
        this.liste_clients[objIndex].adresse = nouveauClient.adresse;
      }
      if (nouveauClient.pays) {
        this.liste_clients[objIndex].pays = nouveauClient.pays;
      }
    }
    this.sauvegarder();
    return this.liste_clients[objIndex];
  }

  /**
   * Retourne le panier d'un client, ou un item de celui-ci
   * @param idClient
   * @param idItem
   * @returns {*}
   */
  recuperePanier (idClient, idItem) {
    const clientIndex = this.getClientIndex(idClient);
    if (idItem >= 0) {
      const itemIndex = this.liste_clients[clientIndex].panier.items.findIndex(obj => obj.id === idItem);
      return this.liste_clients[clientIndex].panier.items[itemIndex];
    }
    return this.liste_clients[clientIndex].panier;
  }

  /**
   * Ajoute un item au panier. Provoque la mise à jour de la valeur du panier.
   * @param idClient
   * @param item
   */
  ajoutePanier(idClient, item) {
    const clientIndex = this.getClientIndex(idClient);
    item.id = this.recupereProchainIDItem(idClient);
    this.liste_clients[clientIndex].panier.items.push(item);
    this.calculePanier(idClient);
    return this.liste_clients[clientIndex].panier;
  }

  /**
   * Retourne l'index du client idClient dans la liste interne.
   * @param idClient
   * @returns {number}
   */
  getClientIndex(idClient) {
    return this.liste_clients.findIndex(obj => obj.id === idClient);
  }

  /**
   * Calcule la valeur du panier d'un client
   * @param idClient
   */
  calculePanier(idClient) {
    const indexClient = this.getClientIndex(idClient);
    const client = this.liste_clients[indexClient];
    client.panier.valeur = client.panier.items.reduce(function (a, b) {
      return a + (b.quantite * b.prix);
    }, 0);
    this.sauvegarder();
  }

  /**
   * Retrouve un produit dans un panier selon l'id du produit
   * @param idClient
   * @param idProduit
   * @returns {*}
   */
  recupereProduitDansPanier(idClient, idProduit) {
    const indexClient = this.getClientIndex(idClient);
    const panier = this.liste_clients[indexClient].panier;
    const itemIndex = panier.items.findIndex(obj => obj.idProduit === idProduit);

    return panier.items[itemIndex];
  }

  /**
   * Modifie un produit dans le panier d'un client. La seule modification possible est la quantité.
   * Pour retirer, mettre une quantité négative. Pour ajouter, une quantité positive.
   * @param idClient
   * @param idItem
   * @param modification
   * @returns {*}
   */
  modifierPanier(idClient, idItem, modification) {
    const indexClient = this.getClientIndex(idClient);
    const panier = this.liste_clients[indexClient].panier;
    const itemIndex = panier.items.findIndex(obj => obj.id === idItem);
    this.liste_clients[indexClient].panier.items[itemIndex].quantite += modification;

    this.calculePanier(idClient);
    return panier;
  }

  /**
   * Retire un produit du panier
   * @param idClient
   * @param item
   * @returns {*}
   */
  retirePanier(idClient, item) {
    const indexClient = this.getClientIndex(idClient);
    const panier = this.liste_clients[indexClient].panier;
    const itemIndex = panier.items.findIndex(obj => obj.id === item.id);
    panier.items.splice(itemIndex, 1);
    this.calculePanier(idClient);
    return panier;
  }

  /**
   * Converti le panier en vente. Ajoute la vente dans l'historique et efface le panier
   * @param client
   * @param vente
   */
  acheterPanier(client, vente) {
    const indexClient = this.getClientIndex(client.id);
    this.liste_clients[indexClient].historique.push(vente);
    this.liste_clients[indexClient].panier = new Panier(0, []);
    this.sauvegarder();
  }

  /**
   * Modifie le status d'un élément de l'historique
   * @param vente
   * @param status
   */
  modifierStatusHistorique(vente, status) {
    const indexClient = this.getClientIndex(vente.idClient);
    const indexVente = this.liste_clients[indexClient].historique.findIndex(obj => obj.id === vente.id);
    this.liste_clients[indexClient].historique[indexVente].status = status;
    this.sauvegarder();
  }
}

module.exports = CollectionClient;
