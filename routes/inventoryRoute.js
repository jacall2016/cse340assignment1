// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invCont = require("../controllers/invController.js")
const utilities = require("../utilities");

// Route to build inventory by classification view with error handling
router.get("/type/:classificationId", utilities.handleErrors(invCont.buildByClassificationId));

// Route to show inventory item detail with error handling
router.get("/detail/:invId", utilities.handleErrors(invCont.showInventoryItemDetail));

module.exports = router;