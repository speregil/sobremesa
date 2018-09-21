var flickrService = require('../services/flickr.engine');
var vaService = require('../services/va.engine');

var controller = {};

controller.search = function(meta){
    var fullSearch = [];
    var errSearch = [];

    var flickrResults = flickrService.search(meta).then(function(results, err){
        if(results.length > 0)
            fullSearch = fullSearch.concat(results);
        if(err != "" && typeof(err) != 'undefined'){
            errSearch.push("Flickr");
            console.log("Problemas en la busqueda con Flickr: " + err);
        }
    }, function(){});

    var googleResults = new Promise((resolve, reject) => {resolve()});
    var wikimediaResults = new Promise((resolve, reject) => {resolve()});
    
    var vnaResults = vaService.search(meta).then(function(){console.log("Busqueda en VA completa")},function(){});


    return new Promise(function(resolve,reject){
        Promise.all([flickrResults, googleResults, wikimediaResults, vnaResults]).then(function(){
            resolve(fullSearch, errSearch);
        }, function(){
            reject("Algo impidio que al menos una busqueda no se resolviera");
        })
    });   
}

module.exports = controller;