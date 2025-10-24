// backend/models/DeliveryCost.model.js
import mongoose from 'mongoose';

// --- UPDATED: Added a currency field ---
const CompanyDetailSchema = new mongoose.Schema({
    priceHome: { type: Number, default: 0 },
    priceOffice: { type: Number, default: 0 },
    companyName: { type: String, trim: true, default: 'Not Specified' },
    logoUrl: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    currency: { type: String, default: 'DZD', enum: ['DZD', 'USD', 'EUR'] }
}, { _id: true });

const WilayaConfigSchema = new mongoose.Schema({
    companies: [CompanyDetailSchema],
}, { _id: false });

const DeliveryCostSchema = new mongoose.Schema({
    singleton: {
        type: String,
        default: 'config',
        unique: true
    },
    costs: {
        type: Map,
        of: WilayaConfigSchema,
        default: {}
    }
}, { timestamps: true });

const DeliveryCost = mongoose.model('DeliveryCost', DeliveryCostSchema);
export default DeliveryCost;