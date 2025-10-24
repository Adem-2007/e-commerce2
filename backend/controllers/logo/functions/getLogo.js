// controllers/logo/functions/getLogo.js
import Logo from '../../../models/logo.model.js';

export const getLogo = async (req, res) => {
    try {
        const logo = await Logo.getSingleton();

        // If no logo exists in the DB, return default values.
        if (!logo) {
            return res.status(200).json({ name: 'Aura', imageUrl: '' });
        }

        res.status(200).json(logo);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching logo configuration.', error: error.message });
    }
};