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

router.post('/config',function(req, res, next){
    var config = req.body.config;
    console.log("Cambiando configuración: " + req.body.config);
    if(typeof(config) != 'undefined'){
        controller.config(config).then(function(results, err){
            res.status(200);
            res.json(results);
        });
    }
    else{
        res.status(500);
        res.send("Formato de configuración vacio o no válido");
    }
});

module.exports = router;