const { body } = require("express-validator")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  let title = ''
  let grid = ''
  if (data.length == 0) {
    title = 'No inventory for this Classification'
  } else {
    grid = await utilities.buildClassificationGrid(data)
    className = data[0].classification_name
    title = className + " vehicles"
  }
  let nav = await utilities.getNav()
  res.render("./inventory/classification", {
    title,
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

invCont.error500 = async function (req, res, next) {
  next({ status: 500, message: 'It broke' })
}

invCont.buildManager = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classification_names = await utilities.buildClassificationDropDown()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classification_names,
    errors: null,
  })
}

invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: 'Add Classification',
    nav,
    errors: null
  })
}

invCont.buildAddInventory = async function (req, res) {
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

/* ****************************************
*  Add inventory
* *************************************** */
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ****************************************
*  Add inventory View
* *************************************** */
invCont.buildEditInventory = async function (req, res) {
  const inv_id = parseInt(req.params.inv_id)
  const nav = await utilities.getNav()
  let itemData = await invModel.getInventoryByInventoryId(inv_id)
  itemData = itemData[0]
  const classification_names = await utilities.buildClassificationDropDown()
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: 'Edit ' + itemName,
    nav,
    classification_names,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

invCont.buildDeleteView = async function (req, res) {
  const inv_id = parseInt(req.params.inv_id)
  const nav = await utilities.getNav()
  let itemData = await invModel.getInventoryByInventoryId(inv_id)
  itemData = itemData[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: 'Edit ' + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    classification_id: itemData.classification_id
  })

}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_id, inv_make, inv_model } = req.body
  console.log(inv_id);
  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    const itemName = inv_make + " " + inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont