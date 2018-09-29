'use strict' // força o js a ser mais criterioso

const express = require('express');
// tudo que coloca sem caminho, ele busca direto na node_modules
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const route = router.get('/', (req, res, next) =>{
    res.status(200).send({
        title: "Node Store API",
        version: "0.0.1"
    });
});

const create = router.post('/', (req, res, next) =>{
    res.status(201).send(
        req.body
    );// to enviando uma resposta
});

const put = router.put('/:id', (req, res, next) =>{
    const id = req.params.id;
    res.status(200).send({
        id: id, 
        item: req.body
    });// to enviando uma resposta
});

const del = router.delete('/', (req, res, next) =>{
    res.status(200).send(
        req.body
    );// to enviando uma resposta
});

app.use('/',route);
app.use('/products',create);
app.use('/products',put);
app.use('/products',del);

module.exports = app;