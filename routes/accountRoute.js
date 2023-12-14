// Needed Resources 
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const Util = require("../utilities/index");
const validate = require('../utilities/account-validation')

router.get("/",Util.checkLogin, Util.handleErrors(accountController.buildManagement))

router.get("/login", Util.handleErrors(accountController.buildLogin))

router.get("/logout", Util.handleErrors(accountController.accountLogOut))

router.get("/register", Util.handleErrors(accountController.buildRegister))

router.get("/update/:account_id", Util.handleErrors(accountController.buildUpdateView))

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

router.post(
  "/updateAccount",
  validate.updateAccountRules(),
  validate.checkUpdateAccount,
  Util.handleErrors(accountController.updateAccount)
)

router.post(
  "/updatePassword",
  validate.updatePasswordRules(),
  validate.checkUpdatePassword,
  Util.handleErrors(accountController.updateAccountPassword)
  
)

module.exports = router