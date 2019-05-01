import {AfterViewInit, Component, ElementRef, ViewChild, Renderer2} from '@angular/core';
import { interval } from 'rxjs';
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

  // Temporizador para el cambio de imágenes
  source = interval(500);

  // Tiempo (en segundos) para el cambio de imágenes
  shift = 10;

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

    this.source.subscribe(val => this.shiftImages(val));
  }

  /**
   * Solicita la promesa de búsqueda de imágenes para un elemento específico de la tabla y agrega un objeto
   * con la identificación del elemento y los resultados a la lista de photos
   * @param query Criterios de busqueda para las fuentes seleccionadas
   * @param elementID Identificador del elemento en el DOM al que corresponde la busqueda
   */
  metaSearch(query, elementID){
      this.service.metaSearch(query).subscribe(data => {
        this.photoList.push({id:elementID, lst:data['photos'], pos:0});
        var first = data['photos'][0];
        if(first)
          this.loadPhoto(elementID,data['photos'][0].uri);
        else
          this.setDefaultImage(elementID);
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

  setDefaultImage(elementID){
    var photos = this.photoView.nativeElement.children;
    for(var i = 0; i < photos.length; i++){
      var imgTags = photos[i].children;
      if(imgTags[0].id == elementID){
        var type = imgTags[0].classList;
        if(type.contains('instrumento'))
          this.loadPhoto(elementID,"assets/instrumento.png");
        else if(type.contains('mueble'))
          this.loadPhoto(elementID,"assets/muebles.png");
        else if(type.contains('vestuario'))
          this.loadPhoto(elementID,"assets/vestuario.png");
        else if(type.contains('joyeria'))
          this.loadPhoto(elementID,"assets/joyeria.png");
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

  /**
   * Cambia las imagenes de todas las casillas por la siguientes diponible en la lista pre - cargada
   * @param timer Temporizador que se usa para verificar el cambio
   */
  public shiftImages(timer){
    if(timer > 0 && timer%this.shift == 0){
      console.log("Shifting...");
      var photos = this.photoView.nativeElement.children;
      var rands = this.getRandomItems(photos);
      for(var i = 0; i < rands.length; i++){
        var imgTags = rands[i]['children'];
        var photoList = this.searchPhotoList(imgTags[0].id);
        var lst = photoList["lst"];
        var curPos = photoList["pos"];
        if(lst){
          if(curPos + 1 < lst.length){
            this.loadPhoto(imgTags[0].id, lst[curPos + 1].uri);
            photoList["pos"] = curPos + 1;
          }
          else{
            if(lst[0]){
              this.loadPhoto(imgTags[0].id, lst[0].uri);
              photoList["pos"] = 0;
            }
            else{
              console.log("Cargando imagen por defecto...");
              this.setDefaultImage(imgTags[0].id);
            }
          }
        }
        else{
          console.log("Cargando imagen por defecto...");
          this.setDefaultImage(imgTags[0].id);
        }
      }
    }
  }

  private getRandomItems(array): object[]{
    var rands = [];
    var num = Math.floor(Math.random()*array.length);
    for(var i = 0; i < num + 1;i++){
      rands.push(array[Math.floor(Math.random()*array.length)]);
    }
    return rands;
  }
}