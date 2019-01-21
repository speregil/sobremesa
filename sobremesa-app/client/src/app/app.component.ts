import {AfterViewInit, Component, ElementRef} from '@angular/core';
import { Service } from './app.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit{
  constructor(private service: Service, private elementRef: ElementRef){}

  google = true;
  flickr = true;
  victoria = true;
  googlePr = "";
  flickrPr = "";
  vaPr = "";
  num = 5;

  getColumns() {
    return Array.from(Array(25).keys()).map(i => 0 + i);   
  }

  getRows() {
    return Array.from(Array(20).keys()).map(i => 0 + i);   
  }

  metaSearch(query, element){
    this.service.metaSearch(query).subscribe(data => element.src = data[0].uri);
  }

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

  ngAfterViewInit(): void {
    const img = this.elementRef.nativeElement.querySelector('#img0');
    this.metaSearch(img.alt, img);
  }
}
