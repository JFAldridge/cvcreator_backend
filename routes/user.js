const express = require('express');
const router = express.Router();

router.put('/userinfo', function(req, res, next) {

    req.user.userInfo = req.body.userInfo;

    req.user.save(function(err, user) {
        if (err) return next(err);
        res.json({message: 'Changes saved'});
    });
})

router.get('/userinfo', function(req, res, next) {
    return res.json({
        userInfo: req.user.userInfo
    });
})

module.exports = router;