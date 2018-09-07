var express = require('express');

var controller = require('../controllers/flickr.engine');
var router = express.Router();

router.get('/test', function(req, res, next) {
    controller.test(req, res, next);
});

module.exports = router;