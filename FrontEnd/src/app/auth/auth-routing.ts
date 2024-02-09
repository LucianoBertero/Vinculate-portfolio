import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { PreLoadingComponent } from './pre-loading/pre-loading.component';
import { ProteccionInicioGuard } from '../guards/proteccion-inicio.guard';

const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [ProteccionInicioGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [ProteccionInicioGuard],
  },
  {
    path: 'preLoading',
    component: PreLoadingComponent,
    canActivate: [ProteccionInicioGuard],
  },
];

// ,canActivate: [ProteccionInicioGuard]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
