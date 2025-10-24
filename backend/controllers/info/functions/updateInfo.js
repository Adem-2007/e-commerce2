// controllers/info/functions/updateInfo.js
import Info from '../../../models/Info.model.js';

// --- Update the single info document ---
export const updateInfo = async (req, res) => {
  try {
    // The express.json() middleware has already parsed the incoming request body.
    const incomingData = req.body;

    // Atomically find and update the single document with the new data
    const updatedInfo = await Info.findOneAndUpdate({}, incomingData, { 
      new: true, // Return the updated document
      upsert: true, // Create it if it doesn't exist
      runValidators: true // Ensure schema validation runs
    });
    
    res.status(200).json(updatedInfo);
  } catch (error) {
    console.error("--- UPDATE INFO FAILED ---", error);
    res.status(400).json({ message: 'Error updating info', error: error.message });
  }
};