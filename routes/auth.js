const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');

router.post('/login', function(req, res, next) {

    passport.authenticate('local', {session: false}, (err, user, info) => {
        
        if (err || !user) {
            return res.status(400).json({
                message: err,
                user
            });
        }

        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }

            const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
            return res.json({token});
        });
    })(req,res,next);
});

router.post('/register', function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const user = new User({
        email,
        password
    });
    user.save(function(err, user) {
        if (err) return next(err);
        res.json(user);
    }); 
});

module.exports = router;