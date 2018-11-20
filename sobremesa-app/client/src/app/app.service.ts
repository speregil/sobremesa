import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class Service {
  
    constructor ( private http: HttpClient) {}

    metaSearch(meta : string){
        return this.http.get<{}>('http://localhost:3000/search/' + meta);
    }

    changeConfig(pConfig : {}){
        return this.http.post('http://localhost:3000/search/config', {config: pConfig});
    }
}