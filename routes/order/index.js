//SETUP - Modules
var express = require('express');
var router = express.Router();

//SETUP - Import Routes
const all = require('./all')
const create = require('./create')
const update = require('./update')
const update = require('./delete')


router.use('/', all);
router.use('/', create);
router.use('/', update);
router.use('/', Delete);


module.exports = router;