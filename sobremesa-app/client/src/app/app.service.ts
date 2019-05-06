import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Servicio para el acceso al API del servidor
 */
@Injectable()
export class Service {
  
    host = '54.175.193.171:4200';

    constructor ( private http: HttpClient) {}

    /**
     * Servicio para el acceso a la función de busqueda de imagenes del API del servidor
     * @param meta Criterios de busqueda para las imagenes
     * @return Promesa que espera un objeto con la información de las imágenes encontradas
     */
    metaSearch(meta : string){
        return this.http.get<{}>('http://' + this.host + '/search/' + meta);
    }

    /**
     * Servico para el acceso a la función de cambio de criterios de búsqeda del API del servidor
     * @param pConfig Objeto de configuración con todos los elementos de configuración
     * @return Promesa que espera un objeto con los datos de la nueva configuración
     */
    changeConfig(pConfig : {}){
        return this.http.post('http://' + this.host + '/config', {config: pConfig});
    }

    getConfig(){
        return this.http.get<{}>('http://' + this.host + '/config'); 
    }
}