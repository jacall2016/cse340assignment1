const accountModel = require("../models/account-model");
const { body, validationResult } = require("express-validator");
const utilities = require(".");
const validate = {};

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
  ];
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email, account_password } = req.body;
  let errors = [];
  errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [

    body("account_firstname")
      .trim()
      .isLength({ min: 1})
      .withMessage("enter first name"),

    body("account_lastname")
      .trim()
      .isLength({ min: 2})
      .withMessage("enter last name"),

    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailEists = await accountModel.checkExistingEmail(
        account_email
      );
      if (emailExists) {
        throw new Error("Email exists. please use another email");
      }
    }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return;
  }
  next();
};

validate.checkLoginData = async (req, res, next) => {
  const { account_email, account_password } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
      account_password,
    });
    return;
  }
  next();
};


validate.updateRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("First name requires least one character")
      .notEmpty()
      .withMessage(
        "Please fill out the first name field. *First name is required*"
      ),
    body("account_lastname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Last name requires least one character")
      .notEmpty()
      .withMessage(
        "Please fill out the last name field. *Last name is required*"
      ),
    // valid email is required
    // if email is being changed, it cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id;
        const account = await accountModel.getAccountById(account_id);
        // Check if submitted email is same as existing
        if (account_email != account.account_email) {
          // No - Check if email exists in table
          const emailExists = await accountModel.checkExistingEmail(
            account_email
          );
          // Yes - throw error
          if (emailExists.count != 0) {
            throw new Error("Email exists. Please use a different email");
          }
        }
      }),
    body("account_id").trim().isInt().withMessage("Account ID is not valid"),
  ];
};


validate.checkUpdateUserData = async (req, res, next) => {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;
  let errors = [];
  errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    res.render("account/updateAccount", {
      title: "Update Account",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    });
    return;
  }
  next();
};

validate.passwordRules = () => {
  return [
    body("account_Password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols:1,
      })
      .withMessage("Password must be at least 8 characters long"),
  ];
};

validate.checkPasswordData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = validate;