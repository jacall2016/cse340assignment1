// accountRoute.js

const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController.js");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation')

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

//deliver account Managment view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.getAccountManagementView)
);

// Get Update Account View
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.getUpdateAccountView)
);

// Update Account Information
router.post(
  "/update-info/",
  utilities.checkLogin,
  regValidate.updateRules(),
  regValidate.checkUpdateUserData,
  utilities.handleErrors(accountController.updateAccount)
);

// Change Password
router.post(
  "/change-password/:account_id",
  //()=>{console.log("GOT A change-password REQ")},
  utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.changePassword)
);

router.get(
  '/logout', 
  accountController.logout
);

// Export the router for use elsewhere
module.exports = router;
