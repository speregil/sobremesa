/**
 * Controla la configuración básica de la busqueda y el proceso de recuperación de imagenes de las
 * diferentes fuentes
 */

 //------------------------------------------------------------------------------------------------
 // Dependencias
 //------------------------------------------------------------------------------------------------

var flickrService = require('../services/flickr.engine');   // Servicio que se conecta con el API de Flickr
var vaService = require('../services/va.engine');           // Servicio que se conecta con el API del V&A museum
var googleService = require('../services/google.engine');   // Servicio que se conecta con el API de Google

//--------------------------------------------------------------------------------------------------
// Atributos
//--------------------------------------------------------------------------------------------------

var controller = {
    configData : { googleSearch : false,             // Determina si se hace la busqueda con el API de Google o no
                flickrSearch : false,                // Determina si se hace la busqueda con el API de Flickr o no
                vaSearch : false,                    // Determina si se hace la busqueda con el API del V&A museum o no
                googlePrefix : "XIX+century+",      // Prefijos de busqueda por defecto para el APi de Google
                flickrPrefix : "bldigital,",        // Prefijos de busqueda por defecto para el APi de Flickr
                vaPrefix : "",                      // Prefijos de busqueda por defecto para el APi del V&A museum
                numResults : 5                      // Numero de imagenes máximo que se traen por busqueda
            }
};

//---------------------------------------------------------------------------------------------------
// Funciones
//---------------------------------------------------------------------------------------------------

/**
 * Limita la busqueda general realizada en el sistema al máximo definido en la configuración
 * @param {} fullSearch Busqueda completa hecha previamente
 * @returns {} filterSearch Objeto con la lista filtrada de resultados 
 */
function numFilter(fullSearch){
    var filterSearch = [];
    var filter = controller.configData.numResults;
    var searchSize = fullSearch.length;
    if(filter >= searchSize)
        return fullSearch;
    else{
        for(var cent = 0; cent < filter; cent++)
        {
            var i = getRandomInt(0,searchSize);
            var selected = fullSearch[i];
            if(!filterSearch.includes(selected))
                filterSearch.push(selected);
            else
                cent--;
        }
    }
    return filterSearch;
}

/**
 * Retorna un entero al azar dentro del rango abierto especificado por los parámetro
 * @param integer min cota minima del rango 
 * @param integer max cota maxima del rango
 * @returns integer Entero seudo - random dentro del rango especificado
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Cambia los parámetros de configuración con la información en el objeto que entra por parámetro
 * @param {} config Objeto con los nuevos valores de configuración
 * @returns {} configData Objeto con la nueva configuración
 */
controller.config = function(config){
    return new Promise(function(resolve, reject){ 
        controller.configData.googleSearch = config.googleSearch;
        controller.configData.googlePrefix = config.googlePrefix;
        controller.configData.flickrSearch = config.flickrSearch;
        controller.configData.flickrPrefix = config.flickrPrefix;
        controller.configData.vaSearch = config.vaSearch;
        controller.configData.vaPrefix = config.vaPrefix;
        controller.configData.numResults = config.numResults;
        resolve(controller.configData);
    });
}

/**
 * Retorna el objeto de configuración actual
 * @returns {} configData Objeto con la configuración actual
 */
controller.getConfig = function(){
    return new Promise(function(resolve, reject){ 
        resolve(controller.configData);
    });
}

/**
 * Busca usando los APIs activos en la configuración imagenes que coincidan con la metadata que entra por parámentro
 * y los prefijos establecidos en la configuración
 * @params string meta Criterios de busqueda
 * @return [{}] fullSearch Lista con todas las imagenes que coinciden con el citerio de busqueda. la lista está
 * limitada a numero de busquedas específicado en la configuración
 */
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

    // Promise resolve
    return new Promise(function(resolve,reject){
        Promise.all([flickrResults, googleResults, vnaResults]).then(function(){
            resolve(numFilter(fullSearch), errSearch);
        }, function(){
            reject("Algo impidio que al menos una busqueda no se resolviera");
        })
    });   
}

module.exports = controller;