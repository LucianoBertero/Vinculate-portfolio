import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { AuthModule } from './auth/auth.module';

import { PagesModule } from './pages/pages.module'
import { FormsModule } from '@angular/forms';;

import { ComponentsModule } from './components/components.module';

@NgModule({
  declarations: [
    AppComponent,
    NopagefoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    PagesModule,
    ComponentsModule,
    FormsModule        
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
