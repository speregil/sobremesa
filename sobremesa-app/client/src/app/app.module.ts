import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IntroComponent } from './intro.component';
import { AppComponent } from './app.component';
import { ConfigComponent } from './config.component';

import { Service } from './app.service';

const appRoutes: Routes = [
  { path: 'view', component: AppComponent },
  { path: '', component: ConfigComponent }
];

@NgModule({
  declarations: [
    IntroComponent,
    AppComponent,
    ConfigComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    Service
  ],
  bootstrap: [IntroComponent]
})
export class AppModule { }
