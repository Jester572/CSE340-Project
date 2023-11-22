// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities/index');

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build single car
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

//error link
router.get("/500", utilities.handleErrors(invController.error500));


module.exports = router;