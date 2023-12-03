// accountRoute.js
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController.js");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation')

//deliver account Managment view
//JWT Authorization activity
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.getAccountManagementView)
);

// "GET" route for the path that will be sent when the "My Account" link is clicked
router.get(
  "/login", 
  utilities.handleErrors(accountController.buildLogin)
  );

// "GET" route for the registration page
router.get(
  "/register", 
  utilities.handleErrors(accountController.buildRegister)
);

// Process the login attempt
router.post(
  "/login",
  //()=>{console.log("GOT A LOGIN REQ")},
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin),
);

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Export the router for use elsewhere
module.exports = router;
