const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require('./models/user');

passport.use(new localStrategy({
    usernameField: 'email',
}, function(email, password, done) {
    User.findOne({ email: email }, function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false);
     
        // Test a matching password
        user.comparePassword(password, function(err, isMatch) {
            if (err) return done(err);
            if (!isMatch) return done(null, false);
            
            return done(null, user);
        });
    });
}));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, function(jwt_payload, done) {
        return User.findById(jwt_payload._id)
        .then(user => {
            return done(null, user);
        })
        .catch(err => {
            return done(err);
        });
}));
