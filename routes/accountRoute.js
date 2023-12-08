// Needed Resources 
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require('../utilities/index');
const Util = require("../utilities/index");
const validate = require('../utilities/account-validation')

router.get("/login", Util.handleErrors(accountController.buildLogin))

router.get("/register", Util.handleErrors(accountController.buildRegister))

router.get("/management", Util.handleErrors(accountController.buildManagement))

router.post(
    '/register',
    validate.registationRules(),
    validate.checkRegData,
    Util.handleErrors(accountController.registerAccount)
)

// Process the login attempt
// router.post(
//     "/login",
//     validate.loginRules(),
//     validate.checkLoginData,
//     Util.handleErrors(accountController.accountLogin)
// )
router.post(
    "/login",
    validate.loginRules(),
    validate.checkLoginData,
    (req, res) => {
      res.status(200).send('login process')
    }
  )

module.exports = router