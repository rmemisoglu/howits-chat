const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

// models
const User = require('../models/users');

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_LOGIN_CLIENT_ID,
        clientSecret: process.env.GOOGLE_LOGIN_SECRET_ID,
        callbackURL: process.env.GOOGLE_LOGIN_CALLBACK_URL
    }, (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        User.findOne({ googleId: profile.id }).then((currentUser) => {
            if (currentUser) {
                console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                new User({
                    username: profile.displayName,
                    googleId: profile.id
                }).save().then((newUser) => {
                    console.log('new user created ' + newUser);
                    done(null, newUser);
                });
            }
        });
    }));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
    
});

module.exports = passport;