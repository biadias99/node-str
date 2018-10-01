'use strict' // força o js a ser mais criterioso

const express = require('express');
const router = express.Router();
const controller = require ('../controllers/order-controller');

router.post('/', controller.post);
router.get('/', controller.get);

module.exports = router;