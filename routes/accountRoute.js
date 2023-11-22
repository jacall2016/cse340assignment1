// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index.js");
const accountController = require("../controllers/accountController.js");

//a "GET" route for the path that will be sent when the "My Account" link is clicked.
// Route to build inventory by classification view with error handling
router.get("/my-account", utilities.handleErrors(accountController.buildLogin));

module.exports = router;