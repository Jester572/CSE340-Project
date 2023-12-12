// Needed Resources 
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const Util = require("../utilities/index");
const validate = require('../utilities/account-validation')

router.get("/",Util.checkLogin, Util.handleErrors(accountController.buildManagement))

router.get("/login", Util.handleErrors(accountController.buildLogin))

router.get("/register", Util.handleErrors(accountController.buildRegister))

router.post(
  '/register',
  validate.registrationRules(),
  validate.checkRegData,
  Util.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  Util.handleErrors(accountController.accountLogin)
)

module.exports = router