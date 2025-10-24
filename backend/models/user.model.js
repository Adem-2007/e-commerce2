// backend/models/user.model.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        // --- MODIFIED: Password is not required for Google OAuth users ---
        required: false 
    },
    // --- NEW: Field to store Google User ID ---
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows multiple documents to have a null value
    },
    role: { 
        type: String, 
        required: true, 
        enum: ['admin', 'pager', 'creator'], 
        default: 'creator' 
    },
    avatar: {
        type: String,
        default: null,
    },
    permissions: {
        type: [String],
        default: [],
    },
    forceReloginAt: { 
        type: Date 
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

}, { timestamps: true });

// Hash password only if it is provided and modified
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.getResetPasswordCode = function () {
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    this.resetPasswordToken = resetCode;
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetCode;
};

const User = mongoose.model('User', userSchema);
export default User;