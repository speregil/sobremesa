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

  metaSearch(){
    this.service.metaSearch(this.searchTerms).subscribe(data => this.photos = data["photos"]);
  }
}
