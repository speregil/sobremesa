var axios = require('axios');
var textService = require('../services/text.service');
var url = "https://www.vam.ac.uk/api/json/museumobject/search?q=";

var engine = {
    prefix : ""
};

function createSearchURL(meta){
    for(var i = 0; i < meta.length; i++){
        if(meta.charAt(i) === ' ')
            meta = textService.setCharAt(meta,i,'+');
    }
    console.log("V&A searching for: " + engine.prefix + meta);
    return (engine.prefix + meta);    
}

function createPhotoArray(photos){
    var photoArray = [];
    if(photos.length > 0)
    {
    for(i = 0; i < photos.length; i++){
        var key = photos[i].fields.primary_image_id;
        if(typeof(key) != 'undefined'){
            var photo = {
                source : "V&A",
                uri : "http://media.vam.ac.uk/media/thira/collection_images/" + key.substring(0,6) + "/" + key + ".jpg"
            }
            photoArray.push(photo);
        }
    }
    }
    return photoArray;
}

engine.setPrefix = function(pPrefix){
    engine.prefix = pPrefix;
}

engine.search = function(meta){
    var photos = [];
    return new Promise(function(resolve, reject){ 
        axios.get(url + createSearchURL(meta)).then(function(results){
            photos = results.data.records;
            resolve(createPhotoArray(photos),"");
        }, function(error){
            resolve([], "Problemas al conectarse con V&A Museum: " + error);
        });
    });    
}

module.exports = engine;