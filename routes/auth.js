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

            return res.status(200).json({
                token,
                userInfo: req.user.userInfo
            });
        });
    })(req,res,next);
});

router.post('/register', function(req, res, next) {
    const email = req.body.email;
    User.findOne({email}, function(err, user) {
        if (err) {
            return res.status(400).json({
                errMessages: {taken: 'That email has already been taken'}
            });
        }
    });

    const user = new User(req.body);
    user.save()
        .then(function(user) {
            console.log('saved')
            res.status(201).json({
                message: 'Account created'
            });
        })
        .catch(function(err) {
            if (err.name === 'ValidationError') {
                let errMessages = {};

                Object.entries(err.errors).forEach(([errKey, errObj]) => {
                    errMessages[errKey] = errObj.message;
                });
                console.log(errMessages);
                return res.status(400).json({
                    errMessages
                });
            }
            res.status(500).send(err);
        });
});

module.exports = router;