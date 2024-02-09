import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreLoadingComponent } from './pre-loading/pre-loading.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    PreLoadingComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports:[
    RegisterComponent,
    LoginComponent,
    PreLoadingComponent
  
  ]
})
export class AuthModule { }
