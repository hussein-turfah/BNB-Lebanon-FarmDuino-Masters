const express = require("express");
const router = express.Router();
const {
  createItem,
  updateItem,
  getAllItems,
  getItemById,
  deleteItem
} = require("../controller/itemController");

// Create a new item
router.post("/", createItem);

// Update an item by ID
router.put("/:itemId", updateItem);

// Get all items
router.get("/", getAllItems);

// Get an item by ID
router.get("/:itemId", getItemById);

// Delete an item by ID
router.delete("/:itemId", deleteItem);

module.exports = router;
