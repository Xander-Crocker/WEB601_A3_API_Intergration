//SETUP - Modules
var express = require('express');
var router = express.Router();

//SETUP - Import Routes
const all = require('./all')
const one = require('./one')
const register = require('./register')
const update = require('./update')
const deleteUser = require('./delete')
const login = require('./login')
const logout = require('./logout')


router.use('/', all);
router.use('/', one);
router.use('/', register);
router.use('/', update);
router.use('/', update);
router.use('/', deleteUser);
router.use('/', login);
router.use('/', logout);


module.exports = router;