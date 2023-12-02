const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data && Array.isArray(data) && data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  };

  Util.buildVehicleDetails = async function (data) {
    let vehicle = data;
    let vehicleDetails;
    vehicleDetails = `<div class="detail-view">`;
    vehicleDetails += `<h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>`;
    vehicleDetails += `<div class="details-container">`;
    vehicleDetails += `<div class="image-container">`;
    vehicleDetails += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" width="1000"/>`;
    vehicleDetails += `</div>`;
    vehicleDetails += `<div class="info-container">`;
    vehicleDetails += `<h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>`;
    vehicleDetails += `<ul class="detail-info-list">`;
    vehicleDetails += `<li class="list-item price"><span class="bolded">Price:</span> $${new Intl.NumberFormat(
      "en-US"
    ).format(vehicle.inv_price)}</li>`;
    vehicleDetails += `<li class="list-item"><span class="bolded">Description:</span> ${vehicle.inv_description}</li>`;
    vehicleDetails += `<li class="list-item"><span class="bolded">Color:</span> ${vehicle.inv_color}</li>`;
    vehicleDetails += `<li class="list-item"><span class="bolded">Miles:</span> ${new Intl.NumberFormat(
      "en-US"
    ).format(vehicle.inv_miles)}</li>`;
  
    vehicleDetails += `</ul>`;
    vehicleDetails += `</div>`;
    vehicleDetails += `</div>`;
    vehicleDetails += `</div>`;
    return vehicleDetails;
  };

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" >';
  classificationList += "<option>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"${
      classification_id != null && row.classification_id == classification_id
        ? " selected"
        : ""
    }>${row.classification_name}</option>`;
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += `>${row.classification_name}</option>}`;
  });
  classificationList += "</select>";
  return classificationList;
};

// Function to add commas to a number
Util.numberWithCommas = function(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList">';
  classificationList += '<option value="" disabled selected>Classification</option>';
  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"${
      classification_id != null && row.classification_id == classification_id
        ? " selected"
        : ""
    }>${row.classification_name}</option>`;
  });
  classificationList += '</select>';
  return classificationList;
};

Util.getManagementView = async function(req, res, next) {
  try {
    // Construct the HTML content for the management view
    let managementView = '<h1>Management</h1>';

    // Add links for adding new classification and new inventory
    managementView += '<ul>';
    managementView += '<li><a href="../../inv/add-classification" title="Add New Classification">Add New Classification</a></li>';
    managementView += '<li><a href="../../inv/add-inventory" title="Add New Inventory">Add New Inventory</a></li>';
    managementView += '</ul>';

    // Return the constructed HTML
    return managementView;
  } catch (error) {
    // Handle any errors that may occur
    next(error);
  }
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    console.log("not working");
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util