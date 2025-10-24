// controllers/deliveryCost/functions/getCosts.js
import DeliveryCost from '../../../models/DeliveryCost.model.js';

export const getCosts = async (req, res) => {
    try {
        let deliveryConfig = await DeliveryCost.findOne({ singleton: 'config' });
        if (!deliveryConfig) {
            // If no config exists, create a default one
            deliveryConfig = await new DeliveryCost().save();
        }
        res.json({ costs: deliveryConfig.costs });
    } catch (error) {
        console.error('Error fetching delivery costs:', error);
        res.status(500).json({ message: 'Server error fetching costs.' });
    }
};