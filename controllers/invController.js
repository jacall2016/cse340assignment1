const invModel = require("../models/inventory-model")
const utilities = require("../utilities/index.js")

const invCont = {}

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
    grid,
  })
}

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

module.exports =  invCont;