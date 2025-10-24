// backend/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

/**
 * @desc Middleware to protect routes by verifying JWT and ensuring the user is an Admin.
 * This is the primary middleware for all administrative actions.
 */
export const protectAdmin = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // --- OPTIMIZATION: Use .lean() for faster, read-only user fetching ---
            req.user = await User.findById(decoded.id).select('-password').lean();

            if (!req.user) {
                 return res.status(401).json({ message: 'Not authorized, user not found.' });
            }

            // Check if token was issued BEFORE a forced re-login
            if (req.user.forceReloginAt) {
                const reloginTimestamp = parseInt(new Date(req.user.forceReloginAt).getTime() / 1000, 10);
                if (decoded.iat < reloginTimestamp) {
                    return res.status(401).json({ message: 'User data has changed. Please log in again.' });
                }
            }

            // After verifying the token is valid, check the user's role.
            if (req.user.role.toLowerCase() === 'admin') {
                next(); // User is authenticated and is an admin, proceed.
            } else {
                // User is valid, but does NOT have admin rights.
                return res.status(403).json({ message: 'Forbidden: Admin access required.' });
            }

        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided.' });
    }
};


/**
 * @desc Middleware to protect routes that require a logged-in user,
 * regardless of their role.
 */
export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // --- OPTIMIZATION: Use .lean() for faster, read-only user fetching ---
            req.user = await User.findById(decoded.id).select('-password').lean();
            
            if (!req.user) {
                 return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // Check if token was issued BEFORE a forced re-login
            if (req.user.forceReloginAt) {
                const reloginTimestamp = parseInt(new Date(req.user.forceReloginAt).getTime() / 1000, 10);
                if (decoded.iat < reloginTimestamp) {
                    return res.status(401).json({ message: 'User data has changed. Please log in again.' });
                }
            }
            
            next();

        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

/**
 * --- NEW MIDDLEWARE TO FIX THE ERROR ---
 * @desc Middleware to grant access to users who are either an 'admin' or a 'pager'.
 * This should be used AFTER the 'protect' middleware.
 */
export const adminAndPager = (req, res, next) => {
    const allowedRoles = ['admin', 'pager'];
    
    // Assumes 'protect' middleware has already run and attached req.user
    if (req.user && allowedRoles.includes(req.user.role.toLowerCase())) {
        next(); // User has a permitted role, continue.
    } else {
        res.status(403).json({ message: 'Forbidden: Admin or Pager access required.' });
    }
};
/**
 * --- NEW MIDDLEWARE ---
 * @desc Middleware to protect routes for staff members (Admin or Creator).
 * This handles token verification AND role checking in one function.
 */
export const protectStaff = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // --- OPTIMIZATION: Use .lean() for faster, read-only user fetching ---
            req.user = await User.findById(decoded.id).select('-password').lean();

            if (!req.user) {
                 return res.status(401).json({ message: 'Not authorized, user not found.' });
            }

            // Check if token was issued BEFORE a forced re-login
            if (req.user.forceReloginAt) {
                const reloginTimestamp = parseInt(new Date(req.user.forceReloginAt).getTime() / 1000, 10);
                if (decoded.iat < reloginTimestamp) {
                    return res.status(401).json({ message: 'User data has changed. Please log in again.' });
                }
            }

            // --- MODIFICATION: Added 'pager' to the list of allowed staff roles ---
            const allowedRoles = ['admin', 'creator', 'pager'];
            if (allowedRoles.includes(req.user.role.toLowerCase())) {
                next(); // User is authenticated and has a staff role, proceed.
            } else {
                // User is valid, but does NOT have sufficient rights.
                return res.status(403).json({ message: 'Forbidden: Access denied for this role.' });
            }

        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided.' });
    }
};