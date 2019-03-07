import {Component, Renderer2} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Service } from './app.service';


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./app.component.css']
})

/* 
 * Componente que maneja varios criterios de configuración para la visualizacion en la vista principal
 */
export class ConfigComponent {

  //-------------------------------------------------------------------------------------------------------
  // Atributos
  //-------------------------------------------------------------------------------------------------------

  // Controlan las fuentes donde se buscan la imágenes

  google = true;      // Permite la busqueda con el API general de Google 
  flickr = true;      // Permite la busqueda con el API gratuito de Flickr
  victoria = true;    // Permite la busqueda con el API del Victoria&Albert museum

  // Controlan prefijos específicos para cualquier busqueda en todas las fuentes

  googlePr = "";      // Prefijo para la busqueda en Google
  flickrPr = "";      // Prefijo para la busqueda en Flickr
  vaPr = "";          // Prefijo para la busqueda en V&A museum

  num = 5;            // Controla el número de imagenes que las busquedas traen del back-end

  constructor(private service: Service, private renderer: Renderer2){}

  /**
   * Solicita la promesa de cambio de configuración de busqueda en el servidor y escribe un mensaje en consola
   * si se completó con éxito
   */
  changeConfig(){
    console.log("Cambiando Configuración...");
    this.service.changeConfig({
      googleSearch : this.google,
      googlePrefix : this.googlePr,
      flickrSearch : this.flickr,
      flickrPrefix : this.flickrPr,
      vaSearch : this.victoria,
      vaPrefix : this.vaPr,
      numResults : this.num
    }).subscribe(data => console.log("Configuracion cambiada: " + data));
  }
}