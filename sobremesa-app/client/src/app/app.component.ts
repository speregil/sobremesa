import { Component } from '@angular/core';
import { Service } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private service: Service){}

  photos = [];
  searchTerms = "";
  google = true;
  flickr = true;
  victoria = true;
  googlePr = "";
  flickrPr = "";
  vaPr = "";
  num = 5;

  metaSearch(){
    this.service.metaSearch(this.searchTerms).subscribe(data => this.photos = data["photos"]);
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
}
