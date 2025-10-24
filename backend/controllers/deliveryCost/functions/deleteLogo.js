// controllers/deliveryCost/functions/deleteLogo.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// NOTE: This controller is obsolete with the base64 approach, 
// but is included for completeness.
export const deleteLogo = async (req, res) => {
    const { logoUrl } = req.body;

    if (!logoUrl) {
        return res.status(400).json({ message: 'Missing logoUrl.' });
    }
    
    // This logic is for file-based URLs and will not work for base64 data URLs.
    // It is kept here to reflect the original file's logic.
    if (!logoUrl.startsWith('/uploads/delivery/')) {
        return res.status(403).json({ message: 'Invalid file path for deletion.' });
    }

    const filename = path.basename(logoUrl);
    // Adjust the path to go up from controllers/deliveryCost/functions to the project root
    const filePath = path.join(__dirname, '..', '..', '..', '..', 'uploads', 'delivery', filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.json({ message: 'File already deleted or does not exist.' });
            }
            console.error('Error deleting file:', err);
            return res.status(500).json({ message: 'Error deleting file.' });
        }
        res.json({ message: 'Logo deleted successfully.' });
    });
};