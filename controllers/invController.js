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

invCont.buildAddClassification = async function  (req, res) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: 'Add Classification',
    nav,
    errors: null
  })
}

invCont.buildAddInventory = async function  (req, res) {
  const nav = await utilities.getNav()
  const classification_names = await utilities.buildClassificationDropDown()
  res.render("./inventory/add-inventory", {
    title: 'Add Inventory',
    nav,
    classification_names,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  console.log(req.body);
  const { classification_name } = req.body

  const classificationResult = await invModel.addClassification(
      classification_name
  )

  if (classificationResult) {
      req.flash(
          "notice",
          `Congratulations,  ${classification_name} has been added.`
      )
      res.status(201).redirect("/inv/add-classification")
  } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).redirect("/inv/add-classification")
  }
}

invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  console.log(req.body);
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const inventoryResult = await invModel.addInventory(
    inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
  )

  if (inventoryResult) {
      req.flash(
          "notice",
          `Congratulations,  ${inv_year}, ${inv_make} ${inv_model} has been added.`
      )
      res.status(201).redirect("/inv/add-inventory")
  } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).redirect("/inv/add-inventory")
  }
}

module.exports = invCont