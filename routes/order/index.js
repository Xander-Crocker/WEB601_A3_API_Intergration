//SETUP - Modules
var express = require('express');
var router = express.Router();

//SETUP - Import Routes
const all = require('./all')
// const one = require('./one')
const create = require('./create')
// const update = require('./update')
// const cancel = require('./cancel')


router.use('/', all);
// router.use('/', one);
router.use('/', create);
// router.use('/', update);
// router.use('/', update);
// router.use('/', cancel);


module.exports = router;