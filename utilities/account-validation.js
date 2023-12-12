const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require('../models/account-model');

const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the database
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use different email")
                }
            }),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
* Check data and return errors or continue to registration
* ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

validate.loginRules = () => {
    return [
        // valid email is required and cannot already exist in the database
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (!emailExists) {
                    throw new Error("Email does not exist. Please log in or use different email")
                }
            }),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}


/* ******************************
 * Check data and return errors or continue to Login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return
    }
    next()
}


validate.addClassificationRules = () => {
    return [
        // password is required and must be strong password
        body("classification_name")
            .trim()
            .notEmpty()
            .isAlpha()
            .withMessage("Classification does not meet requirements."),
    ]
}

validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
        })
        return
    }
    next()
}

validate.addInventoryRules = () => {
    return [
        // password is required and must be strong password
        body("inv_make")
            .trim()
            .notEmpty()
            .isAlpha()
            .withMessage("Make does not meet requirements."),

        body("inv_model")
            .trim()
            .notEmpty()
            .isAlpha()
            .withMessage("Model does not meet requirements."),

        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Description does not meet requirements."),

        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Image does not meet requirements."),

        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Thumbnail does not meet requirements."),

        body("inv_price")
            .trim()
            .notEmpty()
            .isCurrency()
            .withMessage("Price does not meet requirements."),

        body("inv_year")
            .trim()
            .notEmpty()
            .isInt({
                min: 1000,
                max: 9999
            }
            )
            .withMessage("Year does not meet requirements."),

        body("inv_miles")
            .trim()
            .notEmpty()
            .isInt()
            .withMessage("Miles does not meet requirements."),

        body("inv_color")
            .trim()
            .notEmpty()
            .isAlpha()
            .withMessage("Color does not meet requirements."),
    ]
}

validate.checkInventoryData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inv/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
        })
        return
    }
    next()
}

module.exports = validate