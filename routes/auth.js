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
            console.log(req.user.userInfo)
            return res.json({
                token,
                userInfo: req.user.userInfo
            });
        });
    })(req,res,next);
});

router.post('/register', function(req, res, next) {
    const user = new User(req.body);
    user.save(function(err, user) {
        if (err) return next(err);
        res.json({message: "Registration Successful"});
    }); 
});

module.exports = router;