import { HostListener, Injectable } from '@angular/core';

import { InactivityService } from '../services/inactivity.service';

import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { catchError, map, take, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UsuarioServiceService } from '../services/usuario-service.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardGuard implements CanActivate {
  constructor(
    private usuarioService: UsuarioServiceService,
    private authService: AuthService,
    private router: Router,
    private inactivityService: InactivityService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('activoElguard');
    if (localStorage.getItem('token') !== null) {
      //Alguien esta adentro con la sesion iniciada
      console.log('validaciones activas');
      return this.authService.validarToken().pipe(
        tap((estaAutenticado) => {
          if (!estaAutenticado) {
            localStorage.removeItem('token');
            this.router.navigateByUrl('/preLoading');
          }
        })
      );
    } else {
      return true;
    }
  }
}
