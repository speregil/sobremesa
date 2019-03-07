/**
 * Controlador para el enrutamiento de los diferentes servicios que ofrece el servidor
 */

 //-----------------------------------------------------------------------------------------
 // Dependencias
 //-----------------------------------------------------------------------------------------

var express = require('express');                                   // Nodo de Express
var controller = require('../controllers/search.controller');       // Controlador principal

//------------------------------------------------------------------------------------------
// Atributos
//------------------------------------------------------------------------------------------

var router = express.Router();  // Nodo de enrutamiento

//------------------------------------------------------------------------------------------
// Rutas
//------------------------------------------------------------------------------------------

/**
 * Ruta para el servicio de busqueda
 * GET: Lista de imagenes
 */
router.get('/search/:meta',function(req, res, next){
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

/**
 * Ruta para el servicio de configuración
 * GET: Objeto con la configuración actual
 * POST: Nueva configuración de busqueda
 */
router.get('/config', function(req, res, next){
    console.log("Recuperando Configuración Actual...");
    controller.getConfig().then(function(results, err){
        res.status(200);
        res.json(results);
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