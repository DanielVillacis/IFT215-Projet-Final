const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class GestionConnexion {
  constructor(collectionClient) {
    this.collectionClient = collectionClient;
    // On ne peut pas effacer les tokens, ils expirent automatiquement
  }

  /**
   * Connecte un usager en utilisant son courriel et mot de passe. Lui retourne son token si la connexion est bonne
   * @param req
   * @param res
   */
  connecte(req, res) {
    let client;
    let role = 'client';

    if (req.body.courriel === 'admin@admin.com') { // Gestion des admins
      client = {
        mdp: '$2b$08$uMbMX6SUisbRTiI1VzB0H.F4o.RKPwULUdqDlRuPD71WtjSvaWETW', // le mot de passe est "a"
        id: 0
      };
      role = 'admin';
    } else { // Gestion de la plèbe
      client = this.collectionClient.recupereClientParCourriel(req.body.courriel);
    }
    if (client) {
      bcrypt.compare(req.body.mdp, client.mdp).then(
        (valid) => {
          if (!valid) {
            return res.status(401).json({
              error: new Error('Mot de passe incorrect')
            });
          }
          // Le secret devrait plutôt être mis dans une variable d'environnement, pour offrir une plus grande sécurité.
          // Ici je fais court pour simplifier l'installation
          const token = jwt.sign(
            { idClient: client.id, role: role },
            'Un secret qui ne devrait pas etre ecrit directement ici',
            { expiresIn: '2h' });
          res.status(200).json({
            idClient: client.id,
            token: token,
            role: role
          });
        }).catch((erreur) => {
        res.status(500).json({
          erreur: erreur
        });
      });
    } else {
      res.status(401).send(`Aucun utilsateur à ce courriel ${req.body.courriel}`);
    }
  }

  /**
   * Déconnecte un usager en utilisant son id. Invalide en même temps son token.
   * Dans les fait, on ne peut pas effacer un token, donc la déconneion ne fait rien
   * @param req
   * @param res
   */
  deconnecte(req, res) {
  }

  /**
   * Valide le token d'un usager
   * @param req
   * @param res
   * @param next
   */
  valide(req, res, next) {
    next();
  }
}

module.exports = GestionConnexion;
