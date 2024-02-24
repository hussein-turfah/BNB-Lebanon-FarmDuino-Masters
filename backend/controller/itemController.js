const Item = require('../models/itemSchema');
const { io } = require("../socket");

// Helper function to emit events only if Socket.IO is connected
const emitEventIfConnected = (eventName, eventData) => {
  if (io) {
    io.emit(eventName, eventData);
  } else {
    console.error('Socket.IO is not connected. Unable to emit event:', eventName);
  }
};

// Create Item
const createItem = async (req, res) => {
  try {
    const { name, icon, category, amount } = req.body;

    // Check if required fields are provided
    if (!name || !category || !amount) {
      return res.status(400).json({ message: 'Name, category, and amount are required' });
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    // Create a new item
    const newItem = new Item({
      name,
      icon,
      category,
      amount
    });

    // Save the item
    const savedItem = await newItem.save();

    // Emit Socket.IO event for item creation if connected
    emitEventIfConnected("itemCreated", savedItem);

    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update Item
const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, icon, category, amount } = req.body;

    // Validate itemId
    if (!itemId) {
      return res.status(400).json({ message: 'Item ID is required' });
    }

    let item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    item.name = name;
    item.icon = icon;
    item.category = category;
    item.amount = amount;

    const updatedItem = await item.save();

    // Emit Socket.IO event for item update if connected
    emitEventIfConnected("itemUpdated", updatedItem);

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete Item
const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Validate itemId
    if (!itemId) {
      return res.status(400).json({ message: 'Item ID is required' });
    }

    const deletedItem = await Item.findByIdAndDelete(itemId);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Emit Socket.IO event for item deletion if connected
    emitEventIfConnected("itemDeleted", itemId);

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get All Items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error getting all items:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get Item by ID
const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Validate itemId
    if (!itemId) {
      return res.status(400).json({ message: 'Item ID is required' });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    console.error('Error getting item by ID:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createItem, updateItem, getAllItems, getItemById, deleteItem };
