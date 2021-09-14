// Run using: [Environment]::SetEnvironmentVariable("DEBUG","express:*"); & npm run dev-start
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const mongoose = require('mongoose');

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require('./models/user');

require('dotenv').config();

/*  Start App */
const app = express();

// Add morgan logger
app.use(logger('dev'));

// Connect to database
const mongoDb = process.env.MONGO_DB;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo connection error'));

// Import routes
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

// Add passport
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

// Instead of using body-parser middleware, use the new Express implementation of the same thing
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(passport.initialize());

// Allows React to make HTTP requests to Express application
app.use(cors());

app.get('/', (req, res, next) => {
    res.send('Hello squirrel');
});

app.use('/auth', authRouter);
app.use('/user', passport.authenticate('jwt', {session: false}), userRouter);

app.listen(process.env.PORT, () => {
    console.log(`App listening on ${process.env.PORT}`);
});