import { Component } from '@angular/core';
import { Service } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private service: Service){}

  title = 'Sobremesa Digital';
  fotos = [];

  pruebaBusqueda(){
    this.service.pruebaBusqueda().subscribe(data => this.fotos = data);
  }
}
