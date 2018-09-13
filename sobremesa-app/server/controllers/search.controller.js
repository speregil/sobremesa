var flickrService = require('../services/flickr.engine');

var controller = {};

controller.search = function(meta){
    var fullSearch = [];
    var errSearch = "Engines could not find data: ";
    return new Promise(function(resolve){
        flickrService.search(meta).then(function(results){
            fullSearch = fullSearch.concat(results);
        }, function(err){
            errSearch += err + ",";
        });
        var googleResults = [];
        var wikimediaResults = [];
        var vnaResults = [];
        resolve(fullSearch, errSearch);
    });   
}

module.exports = controller;