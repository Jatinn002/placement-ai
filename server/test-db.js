// Quick test to verify MongoDB Atlas connectivity
const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGO_URI;
console.log("Testing URI:", uri?.replace(/:[^@]+@/, ":****@"));

async function test() {
  try {
    console.log("Connecting...");
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });
    console.log("✅ MongoDB Connected Successfully!");
    console.log("   Host:", mongoose.connection.host);
    console.log("   DB:", mongoose.connection.name);

    // Try a simple write
    const TestSchema = new mongoose.Schema({ test: String });
    const Test = mongoose.model("Test", TestSchema);
    const doc = await Test.create({ test: "hello" });
    console.log("✅ Write test passed! Doc ID:", doc._id);

    // Clean up
    await Test.deleteOne({ _id: doc._id });
    console.log("✅ Delete test passed!");

    await mongoose.disconnect();
    console.log("✅ All tests passed — database is fully working!");
  } catch (err) {
    console.error("❌ FAILED:", err.message);
    if (err.message.includes("ECONNREFUSED") || err.message.includes("timeout")) {
      console.error("\n🔧 FIX: Go to MongoDB Atlas → Network Access → Add IP 0.0.0.0/0");
    }
    if (err.message.includes("authentication") || err.message.includes("auth")) {
      console.error("\n🔧 FIX: Check username/password in .env MONGO_URI");
    }
  }
  process.exit(0);
}

test();
