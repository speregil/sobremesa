var flickrService = require('../services/flickr.engine');
var vaService = require('../services/va.engine');
var googleService = require('../services/google.engine');

var controller = {
    googleSearch : true,
    flickrSearch : true,
    vaSearch : true,
    googlePrefix : "XIX+century+",
    flickrPrefix : "bldigital,",
    vaPrefix : ""
};

controller.config = function(config){

}

controller.search = function(meta){
    var fullSearch = [];
    var errSearch = [];

    //Flickr Search
    var flickrResults = {};
    if(controller.flickrSearch){
        flickrService.setPrefix(controller.flickrPrefix);
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
        flickrResults = new Promise((resolve, reject) => {resolve()});
    }

    //Google Search
    var googleResults = {};
    if(controller.googleSearch){
        googleService.setPrefix(controller.googlePrefix);
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
        googleResults = new Promise((resolve, reject) => {resolve()});
    }
    
    // V&A Search
    var vnaResults = {};
    if(controller.vaSearch){
        vaService.setPrefix(controller.vaPrefix);
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