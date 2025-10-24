// controllers/footer/functions/updateFooter.js
import Footer from '../../../models/footer.model.js';

// Update the footer document
export const updateFooter = async (req, res) => {
  try {
    const footer = await Footer.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true, // Create the document if it doesn't exist
      runValidators: true,
    });
    res.status(200).json({ message: 'Footer updated successfully', data: footer });
  } catch (error) {
    res.status(400).json({ message: 'Error updating footer data', error: error.message });
  }
};