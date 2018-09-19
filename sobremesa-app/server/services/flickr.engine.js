var Flickr = require("flickrapi");

var flickrOptions = {
      api_key: "825af5a753182beb909658cecae17387",
      secret: "b7648ea6e37d6ca4"
    };

var engine = {};

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
    var txtSearch = "antique " + meta;
    console.log("Flicker searching for: " + txtSearch);
    return txtSearch;
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

engine.search = function(meta){
    return new Promise(function(resolve, reject){ 
        auth().then(function(api){       
            api.photos.search({text: createSearchText(meta)}, function(err, result){
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