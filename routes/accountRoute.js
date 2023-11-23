// accountRoute.js
const regValidate = require('../utilities/account-validation')
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController.js");
const utilities = require("../utilities");

// "GET" route for the path that will be sent when the "My Account" link is clicked
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// "GET" route for the registration page
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
router.post(
    "/login",
    (req, res) => {
      res.status(200).send('login process')
    }
  )
// Export the router for use elsewhere
module.exports = router;
