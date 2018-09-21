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

engine.search = function(meta){
    return new Promise(function(resolve, reject){ 
        axios.get(url + createSerachURL(meta)).then(function(results){
            console.log(results.data.records);
            resolve();
        });
    });    
}

module.exports = engine;