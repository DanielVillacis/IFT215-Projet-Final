const jwt = require('jsonwebtoken');

class Auth {
  /**
   * Lorsqu'on doit simplement être connecté (ie le token est valide)
   * @param req
   * @param res
   * @param next
   */
  static basique(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, 'Un secret qui ne devrait pas etre ecrit directement ici');
      next();
    } catch {
      res.status(401).json({
        error: new Error('Invalid request!')
      });
    }
  }

  /**
   * Lorsque le client doit être présent dans la requête :idClient. Un admin est accepté
   * @param req
   * @param res
   * @param next
   */
  static localParam(req, res, next) {
    const id = parseInt(req.params.idClient);
    if (id >= 0) {
      Auth._local(req, res, next, id);
    } else {
      res.status(401).send('Champ idClient manquant dans le chemin de la requête');
    }
  }

  /**
   * Lorsque le client doit être présent dans le corps de la requête. Un admin est accepté
   * @param req
   * @param res
   * @param next
   */
  static localBody(req, res, next) {
    const id = parseInt(req.body.idClient);
    if (id >= 0) {
      Auth._local(req, res, next, id);
    } else {
      res.status(401).send('Champ idClient manquant dans le corps de la requête');
    }
  }

  /**
   * Méthode interne
   * @param req
   * @param res
   * @param next
   * @param idClient
   */
  static _local(req, res, next, idClient) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'Un secret qui ne devrait pas etre ecrit directement ici');
      const userId = decodedToken.idClient;
      const role = decodedToken.role;
      if ((idClient === userId) || role === 'admin') {
        next();
      } else {
        res.status(401).send('Authorisation refusée');
      }
    } catch {
      res.status(401).send('Requête invalide, erreur inconnue');
    }
  }

  /**
   * Lorsque seulement un administrateur doit pouvoir le faire
   * @param req
   * @param res
   * @param next
   */
  static admin(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'Un secret qui ne devrait pas etre ecrit directement ici');
      const role = decodedToken.role;

      if (role !== 'admin') {
        res.status(401).send('Vous devez être administrateur pour effectuer cette tâche');
      } else {
        next();
      }
    } catch (error) {
      console.error(error)
      res.status(401).send('Vous devez être administrateur pour effectuer cette tâche');
    }
  }
}

module.exports = Auth;
