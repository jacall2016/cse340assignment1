/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const accountRouter = require('./routes/accountRoute.js');
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
//const utilities = require("./utilities/index")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require('./database/')
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware

app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser())
app.use(utilities.checkJWTToken);

app.use(flash());

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory routes
app.use("/inv", inventoryRoute);
app.use('/account', accountRouter);

// Specific route handlers go here

// Express Error Handler (Place after all other middleware)
app.get('/badlink', (req, res, next) => {
  // Intentional error to trigger a 404 response for a "bad link"
  next({ status: 404, message: 'This is a deliberate 404 error for the "bad link" route.' });
});

app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  
  // Log the error to console or a dedicated error log file
  console.error(`Error at: "${req.originalUrl}" (${req.method}): ${err.message}`);

  let message;
  if (err.status === 404) {
    message = 'Oops! The page you are looking for does not exist.';
  } else {
    message = 'error! these are not the pages you are looking for';
    // You can log additional details or take specific actions for 500 errors here
  }

  // Render the error page
  res.render("errors/error", {
    title: 'Error',
    message,
    nav
  });
});

/* ***********************
 * Middleware to check token validity
 *************************/
app.use(utilities.checkJWTToken);

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
