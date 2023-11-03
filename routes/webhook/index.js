//SETUP - Modules
var express = require('express');
var router = express.Router();

//SETUP - Import Routes
const webhooks = require('./webhooks')


router.use('/', webhooks);


module.exports = router;