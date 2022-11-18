const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const path = require('path');
const ValidationError = require('express-validation').ValidationError;

const html = require('./routes/html');
const commerces = require('./routes/commerces');
const clients = require('./routes/clients');
const categories = require('./routes/categories');
const produits = require('./routes/produits');
const connexion = require('./routes/connexion');
const ventes = require('./routes/ventes');
const statusCommande = require('./routes/statusCommande');

app.use(express.static('client'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.use('/html', html);
app.use('/commerces', commerces);
app.use('/clients', clients);
app.use('/categories', categories);
app.use('/produits', produits);
app.use('/connexion', connexion);
app.use('/ventes', ventes);
app.use('/statusCommande', statusCommande);

app.use(function(err, req, res, next) {
  if (err instanceof ValidationError) {
    const messages = [];
    for (const cle in err.details) {
      for (const index in err.details[cle]) {
        messages.push(`${cle} ${err.details[cle][index].message}`);
      }
    }
    console.log(messages);
    return res.status(err.statusCode).json(messages);
  }
  return res.status(500).json(err);
});

app.listen(port, () => console.log(`Pro-gramme écoute au http://localhost:${port}`));

