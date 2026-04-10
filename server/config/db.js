const mongoose = require("mongoose");

/** Used when MONGO_URI is missing or blank in .env */
const DEFAULT_LOCAL_URI = "mongodb://127.0.0.1:27017/placement-ai";

const isValidMongoUri = (uri) =>
  /^mongodb(\+srv)?:\/\//i.test(String(uri).trim());

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const fromEnv = process.env.MONGO_URI && String(process.env.MONGO_URI).trim();
  const uri = fromEnv || DEFAULT_LOCAL_URI;

  if (!isValidMongoUri(uri)) {
    console.warn(
      "MONGO_URI must start with mongodb:// or mongodb+srv:// — check your .env file."
    );
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    if (process.env.NODE_ENV === "test") {
      throw error;
    }
    console.error(
      "Tip: Start MongoDB locally, or set MONGO_URI in .env to your Atlas connection string."
    );
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    console.warn(
      "Server starting without MongoDB (development). Database routes will fail until MongoDB is reachable."
    );
  }
};

module.exports = connectDB;
