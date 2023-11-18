const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get inventory item by classification_id
 * ************************** */

// Model method to get details of a specific inventory item by ID
async function getInventoryItemById(invId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [invId]
    );

    return data.rows.length > 0 ? data.rows[0] : null; // Check for empty result set
  } catch (error) {
    console.error("getInventoryItemById error: " + error);
    throw error;
  }
}

module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getInventoryItemById
  };