import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterFormVoluntario } from '../interfaces/register-form-usuario.interface';
import { tap, map, catchError, delay } from 'rxjs/operators';

import { environment } from '../../enviroments/enviroment';
import { LoginForm } from '../interfaces/login-form.interface';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { Observable, of } from 'rxjs';

const base_url = environment.base_url;
declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public usuario: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  get role() {
    return this.usuario.role;
  }

  guardarLocalStorage(token: string) {
    console.log('Uso auth service');
    localStorage.setItem('token', token);
    localStorage.setItem('emailUser', this.usuario.email);
  }

  logout() {
    console.log('Uso auth service');
    this.usuario = null;
    localStorage.clear();
    this.ngZone.run(() => {
      this.router.navigate(['/preLoading']);
    });
  }

  loginGoogle(token: string) {
    console.log('Uso auth service');
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        const { token } = resp;
        localStorage.setItem('token', token);
        localStorage.setItem('google', 'true');
      })
    );
  }

  login(formData: LoginForm) {
    console.log('authService');
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        const { token, usuario } = resp;
        const { role, uid } = usuario;
        localStorage.setItem('token', token);
        localStorage.setItem('google', 'false');
        localStorage.setItem('user', role);
        localStorage.setItem('uId', uid);
        // const { email, google, name, role, img = '', uid } = resp.usuario;
        // this.usuario = new Usuario(name, email, '', google, role, uid, img);
      })
    );
  }

  validarToken(): Observable<boolean> {
    console.log('Uso auth service');
    console.log('validarToken');
    return this.http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': this.token,
        },
      })
      .pipe(
        map((resp: any) => {
          console.log(resp);
          const {
            email = '',
            google = false,
            img = '',
            name,
            role,
            uid,
          } = resp.usuario;
          this.usuario = new Usuario(name, email, '', google, role, uid, img); //esto lo hacemos para crear una instancia del mismo y asignarle los valores
          // localStorage.setItem('token', resp.token );
          // localStorage.setItem('menu',resp.menu)

          this.guardarLocalStorage(resp.token);

          return true;
        }),
        catchError((error) => {
          console.log('fallo');
          console.log(error);
          return of(error);
        })
      );
  }
}
