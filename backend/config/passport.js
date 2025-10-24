import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';

const configurePassport = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Find a user based on their Google ID
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                // If user is found by Google ID, proceed
                return done(null, user);
            } else {
                // If not, check if an account with that email already exists
                user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    // Email exists, so link the Google ID to this account
                    user.googleId = profile.id;
                    // Optionally update the avatar if it's not already set
                    if (!user.avatar && profile.photos && profile.photos.length > 0) {
                        user.avatar = profile.photos[0].value;
                    }
                    await user.save();
                    return done(null, user);
                } else {
                    // --- MODIFICATION: User does not exist, so fail authentication ---
                    // We return `false` to indicate that no user was found and no error occurred.
                    // This prevents new users from being created via Google OAuth.
                    return done(null, false);
                }
            }
        } catch (error) {
            // In case of a database or other error
            return done(error, false);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};

export default configurePassport;