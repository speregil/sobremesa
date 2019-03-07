import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ConfigComponent } from './config.component';

import { Service } from './app.service';

const appRoutes: Routes = [
  { path: 'view', component: AppComponent },
  { path: '', component: ConfigComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ConfigComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    Service
  ],
  bootstrap: [ConfigComponent]
})
export class AppModule { }
