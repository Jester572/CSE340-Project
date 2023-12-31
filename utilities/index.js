const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<div id='navBar'><div class='hamToggle' id='hamButton'>☰</div><ul id='navList'>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul></div>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + 'details"><img src="' + vehicle.inv_thumbnail
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the Inventory view HTML
* ************************************ */
Util.buildSingleInventoryPage = async function (data) {
  let page
  let imageSection
  let infoSection
  const vehicle = data[0]

  // Build the ImageSection for vehicle
  imageSection = '<div id="vehicle-img-section">'
  imageSection += '<img src="' + vehicle.inv_image + '"alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors" >'

  imageSection += '</div >'

  // Build the InformationSection for vehicle
  infoSection = '<div id="vehicle-info-section">'
  infoSection += '<h1>' + vehicle.inv_year + ' ' + vehicle.inv_make + ', ' + vehicle.inv_model + '</h1>'
  infoSection += '<p>' + '<b>Price: </b>$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
  infoSection += '<p>' + '<b>Color: </b>' + vehicle.inv_color + '</p>'
  infoSection += '<p>' + '<b>Description: </b>' + vehicle.inv_description + '</p>'
  infoSection += '<p>' + '<b>Mileage: </b>' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'

  infoSection += '</div>'

  // Combine the two sections into one page
  page = '<div id="single-inv-display">'
  page += imageSection
  page += infoSection
  page += '</div>'

  return page
}

/* **************************************
* Build the Login view HTML
* ************************************ */
Util.buildLogin = function () {
  let login = '<div>'
  login += '<form id="loginForm" action="/account/login" method="post">'
  login += '<label for="account_email">E-mail:</label></br><input name="account_email" type="email" id="email" required placeholder="Enter a valid email address"></br>'
  login += '<label for="account_password">Password:</label></br><input name="account_password" type="password" id="password" required pattern="^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{12,}$"></br>'
  login += '<input type="submit" id="login-button" value="Log In">'
  login += '<h2>No account? <a href="/account/register">Sign-up</a></h2>'
  login += '</form>'
  login += '</div>'

  return login
}

Util.buildClassificationDropDown = async function (req, res, next) {
  const data = await invModel.getClassifications()

  let classification_names = ''
  data.rows.forEach((classification) => {
    classification_names += '<option value="' + classification.classification_id + '">' + classification.classification_name + '</option>'
  })
  return classification_names
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 Util.checkAccount = (req, res, next) => {
  if (res.locals.loggedin !== 1) {
    req.flash("error", "You do not have permission to access this page!")
    res.status(403).redirect("/account/login")
  } else {
    // receive the account type from the payload
    const account_type = res.locals.accountData.account_type
    // verify if the account is an employee or an admin
    if (account_type === 'Employee' || account_type === 'Admin') {
      next()
    } else {
      req.flash("error", "You do not have permission to access this page!")
      res.status(403).redirect("/account/login")
    }
  }
}


module.exports = Util