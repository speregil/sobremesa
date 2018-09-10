var Flickr = require("flickrapi");

var flickrOptions = {
      api_key: "825af5a753182beb909658cecae17387",
      secret: "b7648ea6e37d6ca4"
    };

var controller = {};

function autenticar(){

    return new Promise(function(resolve, reject){
        Flickr.tokenOnly(flickrOptions, function(error, flickr) {
            if(error)
                reject("Flickr: Falla en la autenticación: " + error);
            else
                resolve(flickr);  
        });
    });
}

controller.test = function(req, res, next){
    autenticar().then(function(api){
        api.photos.search({
            text: "British Library menswear",
        }, function(err, result){
            if(err) {
                res.status(500);
                res.set('Content-Type', 'text/xml');
                res.send("Problemas al cargar la informacion: " + err);
            }
            else {
                var photos = result.photos.photo;
                res.status(200);
                res.json(photos);
            }
        });
    }, function(error){
            res.status(500);
            res.set('Content-Type', 'text/xml');
            res.send("Problemas al conectarse con Flickr: " + error);
    });
}

module.exports = controller;