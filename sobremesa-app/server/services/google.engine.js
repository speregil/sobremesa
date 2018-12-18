var axios = require('axios');
var textService = require('../services/text.service');

var url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyDERGecwMwWjc-C-YdC02bzi0Pw6QKFFHE&cx=002610522876290491785:-vtu8psekmi&searchType=image&q=";

var engine = {
    prefix : ""
};

function createSearchURL(meta){

    for(var i = 0; i < meta.length; i++){
        if(meta.charAt(i) === ' ')
            meta = textService.setCharAt(meta,i,'+');
    }
    console.log("Google searching for: " + engine.prefix + meta);
    return (engine.prefix + meta);    
}

function createPhotoArray(photos){
    var photoArray = [];
    if(photos.length > 0){
        for(i = 0; i < photos.length; i++){
            var photo = {
                source : "google",
                uri : photos[i].link
            }
            photoArray.push(photo);
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
            photos = results.data.items;
            resolve(createPhotoArray(photos),"");
        }, function(error){
            resolve([], "Problemas al conectarse con Flickr: " + error);
        });
    });    
}

module.exports = engine;