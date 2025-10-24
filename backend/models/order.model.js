// backend/models/order.model.js
import mongoose from 'mongoose';

const orderProductSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    // --- FIX: Added a required price field to capture the price at the time of purchase. ---
    price: { type: Number, required: true },
    selectedColor: { type: String },
    selectedSize: { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    products: [orderProductSchema],
    
    totalPrice: { type: Number, required: true },
    // --- THE FIX: Added a required currency field ---
    currency: {
        type: String,
        required: true,
        enum: ['DZD', 'EUR', 'USD'],
        default: 'DZD'
    },
    subtotal: { type: Number },
    deliveryCost: { type: Number, default: 0 },
    deliveryCompany: {
        companyName: { type: String },
        price: { type: Number }
    },
    deliveryType: { type: String, enum: ['home', 'office'] },

    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone1: { 
        type: String, 
        required: true, 
        trim: true,
        match: [/^\d{10}$/, 'Primary phone number must be exactly 10 digits.']
    },
    phone2: { 
        type: String, 
        trim: true,
        validate: {
            validator: function(v) {
                // Allow it to be null, undefined, or an empty string. 
                // If a value exists, it MUST be 10 digits.
                return !v || v.trim() === '' || /^\d{10}$/.test(v);
            },
            message: 'Optional phone number must be exactly 10 digits.'
        }
    },
    wilaya: { type: String },
    municipality: { type: String },
    address: { type: String },
    orderType: { type: String, enum: ['delivery', 'pickup'], required: true },
    
    status: { 
        type: String, 
        enum: [
            'pending', 
            'confirmed', 
            'no-answer',
            'ready',
            'postponed',
            'on-the-way',
            'delivered',
            'canceled-staff',
            'canceled-customer',
            'returned'
        ], 
        default: 'pending' 
    }
}, { 
    timestamps: true 
});

const Order = mongoose.model('Order', orderSchema);
export default Order;