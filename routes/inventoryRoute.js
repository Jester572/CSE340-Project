// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const Util = require("../utilities/index");
const validate = require('../utilities/account-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));
// Route to build single car
router.get("/detail/:invId", Util.handleErrors(invController.buildByInventoryId));

router.get("/add-classification", Util.handleErrors(invController.buildAddClassification));
router.post("/add-classification", validate.addClassificationRules(), validate.checkClassificationData, Util.handleErrors(invController.addClassification))

router.get("/add-inventory", Util.handleErrors(invController.buildAddInventory));
router.post("/add-inventory",validate.addInventoryRules(), validate.checkInventoryData, Util.handleErrors(invController.addInventory))

//error link
router.get("/500", Util.handleErrors(invController.error500));


module.exports = router;