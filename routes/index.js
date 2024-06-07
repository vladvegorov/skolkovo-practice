var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.isAuthenticated()) {
        var userdata = { authorized: true, name: req.user.username };
    } else {
        var userdata = { authorized: false, name: ''};
    }
    res.render('index', { user: userdata });
});

router.get('/grants', function(req, res, next) {
    if (req.isAuthenticated()) {
        var userdata = { authorized: true, name: req.user.username };
    } else {
        var userdata = { authorized: false, name: ''};
    }
    res.render('grants', { user: userdata });
});

router.get('/services', function(req, res, next) {
    if (req.isAuthenticated()) {
        var userdata = { authorized: true, name: req.user.username };
    } else {
        var userdata = { authorized: false, name: ''};
    }
    res.render('services', { user: userdata });
});

module.exports = router;
