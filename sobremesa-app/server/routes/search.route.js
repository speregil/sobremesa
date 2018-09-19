var express = require('express');

var controller = require('../controllers/search.controller');
var router = express.Router();

router.get('/:meta',function(req, res, next){
    var data = {
        photos : [],
        errors : []
    };

    res.setHeader('content-type', 'application/json');
    controller.search(req.params.meta).then(function(results, err){
        data.photos = results;
        data.errors = err;
        res.status(200);
        res.json(data);
    },function(err){
        res.status(500);
        res.send("Error en el servicio: " + err);
    });
});

module.exports = router;