var Flickr = require("flickrapi");
var textService = require('../services/text.service');

var flickrOptions = {
      api_key: "825af5a753182beb909658cecae17387",
      secret: "b7648ea6e37d6ca4"
    };

var engine = {
    prefix : ""
};

function auth(){

    return new Promise(function(resolve, reject){
        Flickr.tokenOnly(flickrOptions, function(error, flickr) {
            if(error)
                reject("Flickr: Falla en la autenticación: " + error);
            else
                resolve(flickr);  
        });
    });
}

function createSearchText(meta){
    for(var i = 0; i < meta.length; i++){
        if(meta.charAt(i) === ' ')
            meta = textService.setCharAt(meta,i,',');
    }
    console.log("Flicker searching for: " + engine.prefix + meta);
    return (engine.prefix + meta);
}

function createPhotoArray(photos){
    var photoArray = [];
    for(i = 0; i < photos.length; i++){
        var photo = {
            source : "flickr",
            uri : "https://farm" + photos[i].farm + ".staticflickr.com/" + photos[i].server + "/" + photos[i].id + "_" + photos[i].secret + ".jpg"
        }
        photoArray.push(photo);
    }
    return photoArray;
}

engine.setPrefix = function(pPrefix){
    engine.prefix = pPrefix;
}

engine.search = function(meta){
    return new Promise(function(resolve, reject){ 
        auth().then(function(api){       
            api.photos.search({tags: createSearchText(meta), tag_mode: "all"}, function(err, result){
                if(err) 
                    resolve([],"Problemas al cargar la informacion: " + err)
                else {
                    var photos = result.photos.photo;
                    resolve(createPhotoArray(photos), "");
                }
            });
        }, function(error){           
            resolve([], "Problemas al conectarse con Flickr: " + error);
        });
    });    
}

module.exports = engine;