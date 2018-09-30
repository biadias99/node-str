'use strict' // força o js a ser mais criterioso

const express = require('express');
// tudo que coloca sem caminho, ele busca direto na node_modules
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const router = express.Router();

// Conecta ao banco
mongoose.connect('mongodb://bia:bia123@ds035787.mlab.com:35787/nodestr');

// Models
const Product = require('./models/product');

// Rotas
const indexRoutes = require('./routes/index');
const productRoutes = require('./routes/product');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/',indexRoutes);
app.use('/products',productRoutes);

module.exports = app;