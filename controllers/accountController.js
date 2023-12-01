const utilities = require('../utilities/index');
const accountModel = require('../models/account-model');


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    const login = await utilities.buildLogin()
    res.render("account/login", {
        title: "Login",
        nav,
        login,
        errors: null,
    })
}


/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    const register = await utilities.buildRegister()

    res.render("account/register", {
        title: "Register",
        nav,
        register,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )

    if (regResult) {
        const login = await utilities.buildLogin()
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).redirect("/account/login")
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).redirect("/account/register")
    }
}

module.exports = { buildLogin, buildRegister, registerAccount }