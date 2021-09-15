const express = require('express');
const router = express.Router();

router.post('/userinfo', function(req, res, next) {
    console.log(req.user)
    console.log(req.body)
    req.user.userInfo = req.body.userInfo;
    console.log('hhhh')
    console.log(req.user)

    req.user.save(function(err, user) {
        if (err) return next(err);
        res.send(user);
    });
})

module.exports = router;