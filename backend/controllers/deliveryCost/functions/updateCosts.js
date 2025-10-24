// controllers/deliveryCost/functions/updateCosts.js
import DeliveryCost from '../../../models/DeliveryCost.model.js';
import mongoose from 'mongoose';

export const updateCosts = async (req, res) => {
    if (!req.body.costs) {
        return res.status(400).json({ message: 'Invalid request: Missing costs data.' });
    }
    
    const { costs } = req.body;

    // Sanitize the input to remove temporary frontend IDs before saving.
    for (const wilayaCode in costs) {
        if (costs.hasOwnProperty(wilayaCode) && costs[wilayaCode].companies) {
            costs[wilayaCode].companies.forEach(company => {
                // If the _id exists but is not a valid mongoose ObjectId, remove it.
                // Mongoose will then generate a new one automatically upon insertion.
                if (company._id && !mongoose.Types.ObjectId.isValid(company._id)) {
                    delete company._id;
                }
            });
        }
    }

    try {
        const updatedConfig = await DeliveryCost.findOneAndUpdate(
            { singleton: 'config' },
            { $set: { costs } },
            { new: true, upsert: true } // upsert: true creates the document if it doesn't exist
        );

        res.json({ message: 'Costs updated successfully', costs: updatedConfig.costs });
    } catch (error) {
        console.error('Error updating delivery costs:', error);
        res.status(500).json({ message: 'Server error updating costs.' });
    }
};