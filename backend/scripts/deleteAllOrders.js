// scripts/deleteAllOrders.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
// We don't need the Order model for this script anymore,
// as we are interacting with the database directly.

// --- Load Environment Variables ---
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in the .env file.");
  process.exit(1);
}

/**
 * A helper function to format bytes into a human-readable string (KB, MB, GB).
 */
const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Connects to the database, deletes all orders, and then disconnects.
 */
const deleteAllOrders = async () => {
  try {
    // --- 1. Connect to the database ---
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully.");

    // Mongoose pluralizes model names for collections. 'Order' becomes 'orders'.
    const collectionName = 'orders';
    const collection = mongoose.connection.db.collection(collectionName);

    // --- 2. Get a count of documents before deleting ---
    const countBefore = await collection.countDocuments();
    
    if (countBefore === 0) {
      console.log(`The '${collectionName}' collection is already empty. No action taken.`);
      return; 
    }

    // --- THE FINAL FIX: Use a raw DB command to get collection stats. This is the most reliable way. ---
    const stats = await mongoose.connection.db.command({ collStats: collectionName });
    const sizeInBytes = stats.size; // The size is a property on the returned stats object
    const formattedSize = formatBytes(sizeInBytes);

    console.log(`Found ${countBefore} orders with a total size of ${formattedSize}. Proceeding with deletion...`);

    // --- 3. Perform the deletion ---
    const deleteResult = await collection.deleteMany({});
    
    console.log("--- DELETION COMPLETE ---");
    console.log(`Successfully deleted ${deleteResult.deletedCount} orders, freeing up ${formattedSize} of data.`);

  } catch (error) {
    console.error("--- SCRIPT FAILED ---");
    console.error("An error occurred:", error);
    process.exit(1);
  } finally {
    // --- 4. Disconnect from the database ---
    if (mongoose.connection.readyState === 1) {
        console.log("Disconnecting from MongoDB...");
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
  }
};

// --- Run the script ---
deleteAllOrders();