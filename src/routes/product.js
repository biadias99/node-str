'use strict' // força o js a ser mais criterioso

const express = require('express');
const router = express.Router();
const controller = require ('../controllers/product-controller');

router.get('/', controller.get);
router.post('/', controller.post);
router.put('/:id', controller.put);
router.delete('/', controller.delete);

module.exports = router;