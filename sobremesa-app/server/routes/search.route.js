var express = require('express');

var controller = require('../controllers/search.controller');
var router = express.Router();

router.get('/:meta',function(req, res, next){
    res.setHeader('content-type', 'application/json');
    controller.search(req.params.meta).then(function(results, err){
        var data = {
            photos : results,
            errors : err
        }
        res.status(200);
        res.json(data);
    });
});

module.exports = router;