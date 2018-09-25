var axios = require('axios');
var textService = require('../services/text.service');
var url = "https://www.vam.ac.uk/api/json/museumobject/search?q=";

var engine = {};

function createSerachURL(meta){
    for(var i = 0; i < meta.length; i++){
        if(meta.charAt(i) === ' ')
            meta = textService.setCharAt(meta,i,'+');
    }
    console.log("V&A searching for: " + meta);
    return meta;    
}

function createPhotoArray(photos){
    var photoArray = [];
    if(photos.length > 0)
    {
    for(i = 0; i < photos.length; i++){
        var key = photos[i].fields.primary_image_id;
        var photo = {
            source : "V&A",
            uri : "http://media.vam.ac.uk/media/thira/collection_images/" + key.substring(0,6) + "/" + key + ".jpg"
        }
        photoArray.push(photo);
    }
    }
    return photoArray;
}

engine.search = function(meta){
    return new Promise(function(resolve, reject){ 
        axios.get(url + createSerachURL(meta)).then(function(results){
             var photos = results.data.records;
            resolve(createPhotoArray(photos),"");
        }, function(error){
            resolve([], "Problemas al conectarse con Flickr: " + error);
        });
    });    
}

module.exports = engine;