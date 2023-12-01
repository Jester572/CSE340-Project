// Needed Resources 
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require('../utilities/index');
const Util = require("../utilities/index");
const regValidate = require('../utilities/account-validation')

router.get("/login", Util.handleErrors(accountController.buildLogin))

router.get("/register", Util.handleErrors(accountController.buildRegister))

router.post(
    '/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    Util.handleErrors(accountController.registerAccount)
)


module.exports = router