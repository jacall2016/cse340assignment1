const utilities = require("../utilities");
const accountModel = require("../models/account-model"); // Add this require statement
const bcrypt = require("bcryptjs")
/* ****************************************
 * Render login view
 * *************************************** */
async function buildLogin(req, res, next) {
    try {
        //req.flash("notice", "This is a flash message.")
        let nav = await utilities.getNav();
        res.render("account/login", {
        title: "Login",
        nav,
        });
    } catch (error) {
        console.error("Error rendering login:", error);
        next(error); // Pass the error to the next middleware
    }
}

// Function to render the registration view
async function buildRegister(req, res, next) {
    try {
      // Any logic you need for registration goes here
      let nav = await utilities.getNav();
      res.render("account/register", {
        title: "Register",
        nav,
        errors:null,
      });
    } catch (error) {
      console.error("Error rendering registration:", error);
      next(error); // Pass the error to the next middleware
    }
}

// Process Registration function
/* ****************************************
*  Process Registration
* *************************************** */
// Process Registration function
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
      return; // Stop execution if hashing fails
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    );

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      );
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      });
    }
  } catch (error) {
    console.error("Error processing registration:", error);
    res.status(500).render("errors/error", {
      title: '500 Server Error',
      message: 'There was an error processing your registration. Please try again later.',
      nav,
    });
  }
}

// Export the functions for use in accountRoute.js
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount, // Add the new function to the exports
};
