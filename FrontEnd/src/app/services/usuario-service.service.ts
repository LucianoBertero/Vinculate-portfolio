import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterFormVoluntario } from '../interfaces/register-form-usuario.interface';
import { tap, map, catchError, delay } from 'rxjs/operators';

import { environment } from '../../enviroments/enviroment';
import { LoginForm } from '../interfaces/login-form.interface';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { Observable, of } from 'rxjs';
import { updateFormVoluntario } from '../interfaces/updateVoluntarioForm.interface';

const base_url = environment.base_url;
// declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class UsuarioServiceService {
  // public usuario: Usuario;
  constructor(
    private http: HttpClient // private router: Router, // private ngZone: NgZone
  ) {}

  // get token(): string {
  //   return localStorage.getItem('token') || '';
  // }

  // get uid(): string {
  //   return this.usuario.uid || '';
  // }

  // get headers() {
  //   return {
  //     headers: {
  //       'x-token': this.token,
  //     },
  //   };
  // }

  // get role() {
  //   return this.usuario.role;
  // }

  // logout() {
  //   this.usuario = null;
  //   localStorage.clear();
  //   this.ngZone.run(() => {
  //     this.router.navigate(['/preLoading']);
  //   });
  // }

  // guardarLocalStorage(token: string) {
  //   localStorage.setItem('token', token);
  //   localStorage.setItem('emailUser', this.usuario.email);
  // }

  crearUsuario(formData: RegisterFormVoluntario) {
    console.log('Entro a usuario');
    const url = `${base_url}/usuarios`;
    return this.http.post(url, formData).pipe(tap((resp: any) => {}));
  }

  obtenerUsuarioId(id: string, token: string) {
    const url = `${base_url}/usuarios/${id}`;
    return this.http.get(url, {
      headers: {
        'x-token': token,
      },
    });
  }

  deleteVoluntario(id: string, token: string) {
    const url = `http://localhost:3000/api/usuarios/${id}`;
    console.log("entro a delete voluntario en servicio")
    return this.http.delete(url, {
      headers: {
        'x-token': token,
      },
    });
  }

  //actualiza los datos de una organización
  updateDataVoluntario(
    form: updateFormVoluntario,
    uId: string,
    //id: String,
    token: string,
  ) {
    //const url = `http://localhost:3000/api/usuarios/${uId}`;
    const url = `${base_url}/usuarios/${uId}`;
    console.log(uId);
    console.log("Entro al servicio updateDataVoluntario")

    const requestBody = {
           name: form['name'],
          email: form['email'],    
      };

    console.log("Form: ", requestBody)

    return this.http.put(url, requestBody, {
      headers: {
        'x-token': token,
      },
    });
  }

  // validarToken(): Observable<boolean> {
  //   console.log('validarToken');
  //   return this.http
  //     .get(`${base_url}/login/renew`, {
  //       headers: {
  //         'x-token': this.token,
  //       },
  //     })
  //     .pipe(
  //       map((resp: any) => {
  //         console.log(resp);
  //         const {
  //           email = '',
  //           google = false,
  //           img = '',
  //           name,
  //           role,
  //           uid,
  //         } = resp.usuario;
  //         this.usuario = new Usuario(name, email, '', google, role, uid, img); //esto lo hacemos para crear una instancia del mismo y asignarle los valores
  //         // localStorage.setItem('token', resp.token );
  //         // localStorage.setItem('menu',resp.menu)
  //         this.guardarLocalStorage(resp.token);
  //         return true;
  //       }),
  //       catchError((error) => {
  //         console.log('fallo');
  //         console.log(error);
  //         return of(error);
  //       })
  //     );
  // }


  eventSuscribe(id: string, token: string) {
    const url = `http://localhost:3000/api/subscription/${id}`;
    
    return this.http.get(url, {
      headers: {
        'x-token': token,
      },
    });
  }


  // Add this method to UsuarioServiceService
// getUserDetailsById(userId: string, token: string): Observable<any> {
//   const url = `${base_url}/usuarios/${userId}`;
//   return this.http.get(url, {
//     headers: {
//       'x-token': token,
//     },
//   });
// }

  

}
