// backend/models/logo.model.js
import mongoose from 'mongoose';

const LogoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Logo name is required."],
        trim: true,
        default: 'Aura'
    },
    imageUrl: {
        type: String,
        required: [true, "Logo image is required."],
        default: ''
    },
}, { timestamps: true });

// Create a singleton pattern: there should only ever be one logo document.
// The 'logo' collection will have at most one entry.
LogoSchema.statics.getSingleton = function() {
    return this.findOne();
};

const Logo = mongoose.model('Logo', LogoSchema);

export default Logo;