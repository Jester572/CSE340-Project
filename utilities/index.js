const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
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
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util