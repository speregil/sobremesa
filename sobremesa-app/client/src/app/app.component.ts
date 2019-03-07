import {AfterViewInit, Component, ElementRef, ViewChild, Renderer2} from '@angular/core';
import { Service } from './app.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/**
 * Componente que maneja la vista principal del proyecto y el proces de busquedas
 */
export class AppComponent implements AfterViewInit{
  
  //-------------------------------------------------------------------------------------------------------
  // Atributos
  //-------------------------------------------------------------------------------------------------------

  // Lista en memoria del conjunto de fotos que se muestra actualmente
  photoList = [];     

  // Referencia a la tabla en al vista principal con todas las imágenes que se muestran
  @ViewChild("photoView") photoView: ElementRef;

  //-------------------------------------------------------------------------------------------------------
  // Métodos
  //-------------------------------------------------------------------------------------------------------

  constructor(private service: Service, private elementRef: ElementRef, private renderer: Renderer2){}

  /**
   * Despues de cargar la vista principal, el app recorre todos los elementos de la grilla de imágenes
   * y realiza una busqueda de las imagenes que cada celda representa.
   * El sistema asume que el query de busqueda está en el atributo alt del elemento
   */
  ngAfterViewInit(): void {
    var photos = this.photoView.nativeElement.children;
    for(var i = 0; i < photos.length; i++){
      var imgTags = photos[i].children;
      this.metaSearch(imgTags[0].alt, imgTags[0].id); 
    }
  }

  /**
   * Solicita la promesa de búsqueda de imágenes para un elemento específico de la tabla y agrega un objeto
   * con la identificación del elemento y los resultados a la lista de photos
   * @param query Criterios de busqueda para las fuentes seleccionadas
   * @param elementID Identificador del elemento en el DOM al que corresponde la busqueda
   */
  metaSearch(query, elementID){
      this.service.metaSearch(query).subscribe(data => {
        console.log(data);
        this.photoList.push({id:elementID, lst:data['photos']});
        this.loadPhoto(elementID,data['photos'][0].uri);
      });
  }

  /**
   * Asigna al atributo src elemento del DOM con el id que entra por parámetro la fuente de imagen que entra por parámetro
   * @param elementID Identificador del elemento del DOM. Se asume que es un marcador <img>
   * @param pURI Ruta de la imagen que se quiere mostrar
   */
  loadPhoto(elementID, pURI){
    var photos = this.photoView.nativeElement.children;
    for(var i = 0; i < photos.length; i++){
      var imgTags = photos[i].children;
      if(imgTags[0].id == elementID){
        imgTags[0].src = pURI;
      }
    }
  }

  /**
   * Busca la lista de fotos asociadas a un elemento de la grilla de imágenes
   * @param tag ID que identifica al elemento en la grilla de imágenes y en la lista de fotos
   */
  private searchPhotoList(tag): object{
    for(var i = 0; i < this.photoList.length; i++){
      if(this.photoList[i].id == tag)
        return this.photoList[i]
    }
    return {};
  }
}