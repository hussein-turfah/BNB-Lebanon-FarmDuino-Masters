require("dotenv").config();
const mongoose = require("mongoose");

// Set mongoose Promise to global Promise
mongoose.Promise = global.Promise;

// Exit application on error
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  process.exit(-1);
});

/**
 * Connect to MongoDB
 *
 * @returns {Promise} Mongoose connection
 */
exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error(error);
  }
};

/**
 * Disconnect MongoDB
 */
exports.disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
    throw new Error(error);
  }
};
