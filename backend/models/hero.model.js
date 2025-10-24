// backend/models/hero.model.js
import mongoose from 'mongoose';

const LocalizedStringSchema = new mongoose.Schema({
    en: { type: String, required: true, trim: true },
    fr: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
}, { _id: false });

const HeroSchema = new mongoose.Schema({
    title: { type: LocalizedStringSchema, required: true },
    category: { type: LocalizedStringSchema, required: true },
    description: { type: LocalizedStringSchema, required: true },
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    imageType: { type: String, required: true, enum: ['png', 'other'] },
    // --- MODIFICATION: Replaced `backgroundColor` with a more flexible `background` object ---
    background: {
        type: { type: String, enum: ['solid', 'gradient'], default: 'solid' },
        color1: { type: String, trim: true, default: '#F9FAFB' },
        color2: { type: String, trim: true },
        direction: { type: String, trim: true }
    },
    focusPoint: {
        x: { type: Number, default: 0.5 },
        y: { type: Number, default: 0.5 },
    },
}, { timestamps: true });

const Hero = mongoose.model('Hero', HeroSchema);
export default Hero;