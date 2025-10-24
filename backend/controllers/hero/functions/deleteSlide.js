// controllers/hero/functions/deleteSlide.js
import Hero from '../../../models/hero.model.js';
// --- MODIFICATION: No longer need the file deletion helper ---

export const deleteSlide = async (req, res) => { 
    try { 
        const slide = await Hero.findById(req.params.id);
        if (!slide) { 
            return res.status(404).json({ message: 'Slide not found.' }); 
        } 

        // --- MODIFICATION: Filesystem cleanup is no longer needed ---
        await Hero.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Slide deleted successfully.' }); 
    } catch (error) { 
        console.error("Error deleting slide:", error); 
        res.status(500).json({ message: "Server Error: Could not delete the slide.", error: error.message }); 
    } 
};