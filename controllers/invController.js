const invModel = require("../models/inventory-model");
const utilities = require("../utilities/index.js");

const invCont = {};

// Add New Classification to the Database
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


// Add New Inventory Item to the Database
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

// Render management view
invCont.renderManagementView = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  const managementView = await utilities.getManagementView();
  res.render("inventory/management", {
    title: 'Inventory Management',
    nav,
    managementView,
    errors: null,
  });
};

// Build inventory by classification view
invCont.buildByClassificationId = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid
  })
}

// Show inventory item by detail
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

invCont.buildAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  const invData = await invModel.getInventoryById(inv_id);
  const classificationList = await utilities.buildClassificationList(
    invData.classification_id
  );
  const nav = await utilities.getNav();
  res.render("./inventory/editInventory", {
    title: "Edit Inventory Item",
    nav,
    invData,
    classificationList,
    errors: null,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports =  invCont;