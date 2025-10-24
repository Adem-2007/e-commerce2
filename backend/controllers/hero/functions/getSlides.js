// controllers/hero/functions/getSlides.js
import Hero from '../../../models/hero.model.js';

export const getSlides = async (req, res) => { 
    try { 
        const slides = await Hero.find().sort({ createdAt: -1 }); 
        res.status(200).json(slides); 
    } catch (error) { 
        res.status(500).json({ message: "Server Error: Could not fetch slides.", error: error.message }); 
    } 
};