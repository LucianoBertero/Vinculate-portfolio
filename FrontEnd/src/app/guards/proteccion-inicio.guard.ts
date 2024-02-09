import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UsuarioServiceService } from '../services/usuario-service.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProteccionInicioGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('token') !== null) {
      //hay alguien y esta autenticado
      this.authService.validarToken();

      this.router.navigate(['/inicio']);
      return false;
    }
    if (localStorage.getItem('token') === null) {
      //alguien entro como invitado puede volver

      return true;
    }
    return true;
  }
}
