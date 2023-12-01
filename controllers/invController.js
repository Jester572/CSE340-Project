const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

invCont.buildByInventoryId = async function (req, res) {
  const inv_id = req.params.invId

  const data = await invModel.getInventoryByInventoryId(inv_id)
  const page = await utilities.buildSingleInventoryPage(data)
  let nav = await utilities.getNav()
  const vehicleName = data[0].inv_make + ", " + data[0].inv_model
  res.render("./inventory/singleInventoryItem", {
    title: vehicleName,
    nav,
    page,
    errors: null,
  })
}

invCont.error500 = async function(req, res, next) {
  next({status: 500, message: 'It broke'})
}

module.exports = invCont