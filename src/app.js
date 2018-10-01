'use strict' // força o js a ser mais criterioso

const express = require('express');
// tudo que coloca sem caminho, ele busca direto na node_modules
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
const router = express.Router();

// Conecta ao banco
mongoose.connect(config.connectionString);

// Models
const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');

// Rotas
const indexRoutes = require('./routes/index');
const productRoutes = require('./routes/product');
const customerRoutes = require('./routes/customer');
const orderRoutes = require('./routes/order');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/',indexRoutes);
app.use('/products',productRoutes);
app.use('/customers',customerRoutes);
app.use('/orders',orderRoutes);

module.exports = app;