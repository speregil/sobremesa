var flickrService = require('../services/flickr.engine');
var vaService = require('../services/va.engine');
var googleService = require('../services/google.engine');

var controller = {
    configData : { googleSearch : true,
                flickrSearch : true,
                vaSearch : true,
                googlePrefix : "XIX+century+",
                flickrPrefix : "bldigital,",
                vaPrefix : ""
            }
};

controller.config = function(config){
    return new Promise(function(resolve, reject){ 
        controller.configData.googleSearch = config.googleSearch;
        controller.configData.googlePrefix = config.googlePrefix;
        controller.configData.flickrSearch = config.flickrSearch;
        controller.configData.flickrPrefix = config.flickrPrefix;
        controller.configData.vaSearch = config.vaSearch;
        controller.configData.vaPrefix = config.vaPrefix;
        resolve(controller.configData);
    });
}

controller.search = function(meta){
    var fullSearch = [];
    var errSearch = [];

    //Flickr Search
    var flickrResults = {};
    if(controller.configData.flickrSearch){
        flickrService.setPrefix(controller.configData.flickrPrefix);
        flickrResults = flickrService.search(meta).then(function(results, err){
            if(results.length > 0)
                fullSearch = fullSearch.concat(results);
            if(err != "" && typeof(err) != 'undefined'){
                errSearch.push("Flickr");
                console.log("Problemas en la busqueda con Flickr: " + err);
            }
        }, function(){});
    }
    else{
        console.log("Busqueda en Flickr desactivada");
        flickrResults = new Promise((resolve, reject) => {resolve()});
    }

    //Google Search
    var googleResults = {};
    if(controller.configData.googleSearch){
        googleService.setPrefix(controller.configData.googlePrefix);
        googleResults = googleService.search(meta).then(function(results, err){
            if(results.length > 0)
                fullSearch = fullSearch.concat(results);
            if(err != "" && typeof(err) != 'undefined'){
                errSearch.push("Flickr");
                console.log("Problemas en la busqueda con Google: " + err);
            }
        },function(){});
    }
    else{
        console.log("Busqueda en Google desactivada");
        googleResults = new Promise((resolve, reject) => {resolve()});
    }
    
    // V&A Search
    var vnaResults = {};
    if(controller.configData.vaSearch){
        vaService.setPrefix(controller.configData.vaPrefix);
        vnaResults = vaService.search(meta).then(function(results, err){
            if(results.length > 0)
                fullSearch = fullSearch.concat(results);
            if(err != "" && typeof(err) != 'undefined'){
                errSearch.push("Flickr");
                console.log("Problemas en la busqueda con V&A: " + err);
            }
        },function(){});
    }
    else{
        console.log("Busqueda en V&A desactivada");
        vnaResults = new Promise((resolve, reject) => {resolve()});
    }

    return new Promise(function(resolve,reject){
        Promise.all([flickrResults, googleResults, vnaResults]).then(function(){
            resolve(fullSearch, errSearch);
        }, function(){
            reject("Algo impidio que al menos una busqueda no se resolviera");
        })
    });   
}

module.exports = controller;