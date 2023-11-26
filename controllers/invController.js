const invModel = require("../models/inventory-model")
const utilities = require("../utilities/index.js")

const invCont = {}

/* ***************************
 * Render management view
 * ************************** */
invCont.renderManagementView = async function (req, res, next) {
  console.log("renderManagementView function is being called");
  try {
    // Example: Rendering the management view
    let nav = await utilities.getNav();
    let managementView = await utilities.getManagementView(req, res, next); // Include the new function

    // You can customize the title and other data as needed
    res.render("inventory/management", {
      title: 'Inventory Management',
      nav,
      managementView, // Include the management view content
    });
  } catch (error) {
    console.error('Error in renderManagementView:', error);
    next(error);
  }
};

invCont.addNewClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    await invModel.insertNewClassification(classification_name);
    req.flash(
      "notice",
      `New classification ${classification_name} added successfully!`
    );
    res.status(201).redirect("/inv");
  } catch (error) {
    console.error("Error adding new classification:", error);
    req.flash("error", "Error adding new classification.");
    res.status(500).render("inv/classification_add", {
      title: "Add Classification",
      nav,
    });
  }
};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid
  })
}


invCont.buildAddClassification = async function (req, res, next) {
  console.log("buildAddClassification is called");
  const nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 * Show inventory item by detail
 * ************************** */
invCont.showInventoryItemDetail = async function (req, res, next) {
  try {
    const invId = req.params.invId;
    const itemDetails = await invModel.getInventoryItemById(invId);

    // Check if itemDetails is not null or undefined
    if (!itemDetails) {
      throw { status: 404, message: 'Inventory item not found.' };
    }

    // Ensure itemDetails has the expected properties before accessing them
    if (!itemDetails.classification_id) {
      throw { status: 500, message: 'Classification ID not available.' };
    }

   // Format the price before rendering the view
   itemDetails.formattedPrice = utilities.numberWithCommas(itemDetails.inv_price);

   // Format the millage before rendering the view
   itemDetails.formattedMiles = utilities.numberWithCommas(itemDetails.inv_miles);

    // Example: Rendering a view with the item details
    let nav = await utilities.getNav()

    res.render("inventory/detail", {
      title: 'Inventory Item Detail',
      itemDetails,  
      nav,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Add New Inventory Item to the Database
 *  This function handles the POST request for adding a new inventory item.
 *  It retrieves all the necessary data from the request body,
 *  invokes the model function to insert the data into the database,
 *  and then redirects to the inventory management page and displays a success message.
 * ************************** */

invCont.addNewInventoryItem = async function (req, res, next) {
  try {
    const itemData = req.body;
    await invModel.insertNewInventoryItem(itemData);
    req.flash("notice", "New inventory item added successfully!");
    res.status(201).redirect("/inv");
  } catch (error) {
    console.error("Error adding new inventory item:", error);
    req.flash("error", "Error adding new inventory item.");
    res.status(500).render("inv/item_add", {
      title: "Add Inventory Item",
      nav,
    });
  }
};


invCont.buildAddInventoryItem = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add Inventory Item",
    nav,
    classificationList,
    errors: null,
  });
};


invCont.buildAddInventoryItem = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add Inventory Item",
    nav,
    classificationList,
    errors: null,
  });
};


module.exports =  invCont;