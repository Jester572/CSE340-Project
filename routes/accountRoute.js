// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require('../utilities/index');
const Util = require("../utilities/index");

router.get("/login", Util.handleErrors(accountController.buildLogin))

router.get("/register",Util.handleErrors(accountController.buildRegister))

router.post('/register', Util.handleErrors(accountController.registerAccount))


module.exports = router