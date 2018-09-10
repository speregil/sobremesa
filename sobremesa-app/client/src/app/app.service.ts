import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class Service {
  
    constructor ( private http: HttpClient) {}

    pruebaBusqueda(){
        return this.http.get<{}[]>('http://localhost:3000/api/test');
    }
}