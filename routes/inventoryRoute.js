// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invCont = require("../controllers/invController.js")
const validate = require("../utilities/server-form-validation");
const utilities = require("../utilities");

// Route to render the management view with error handling
router.get("/", utilities.handleErrors(invCont.renderManagementView));

// Route to build inventory by classification view with error handling
router.get("/type/:classificationId", utilities.handleErrors(invCont.buildByClassificationId));

// Route to show inventory item detail with error handling
router.get("/detail/:invId", utilities.handleErrors(invCont.showInventoryItemDetail));

// Route to display the form for adding a new classification
router.get("/add-classification/",utilities.handleErrors(invCont.buildAddClassification));

// Route to handle the submission of the add classification form
router.post("/add-classification/",
    validate.addClassificationRules(),
    validate.checkAddClassificationData,
    utilities.handleErrors(invCont.addNewClassification)
);

// Route to display the form for adding a new inventory item
router.get(
    "/add-inventory/",
    utilities.handleErrors(invCont.buildAddInventoryItem)
);
  
  // Route to handle the submission of the add classification form
router.post(
    "/addClassification/",
    validate.addClassificationRules(),
    validate.checkAddClassificationData,
    utilities.handleErrors(invCont.addNewClassification)
);
  
// Route to handle the submission of the add inventory item form
router.post(
    "/add-inventory/",
    validate.addInventoryItemRules(),
    validate.checkAddInventoryItemData,
    utilities.handleErrors(invCont.addNewInventoryItem)
);
  

module.exports = router;