// controllers/footer/functions/getFooter.js
import Footer from '../../../models/footer.model.js';

// Get the single footer document
export const getFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne();
    
    // If no footer exists, create a completely empty one
    if (!footer) {
      footer = new Footer({
          linkSections: [],
          socialLinks: []
      });
      await footer.save();
    }
    
    res.status(200).json(footer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching footer data', error: error.message });
  }
};