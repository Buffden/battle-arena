import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routes } from './app.routes';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: []
})
export class AppModule { } 