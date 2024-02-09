import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';
const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  constructor(
    private http: HttpClient // private router: Router, // private ngZone: NgZone
  ) {}

  changePassword(oldPass: string, newPass: string, id: string, token: string) {
    const url = `http://localhost:3000/api/utilities/changePassword/${id}`;

    // Crear un objeto con los datos a enviar en formato JSON
    const data = {
      oldPassword: oldPass,
      newPassword: newPass,
    };

    return this.http.put(url, data, {
      headers: {
        'x-token': token,
        'Content-Type': 'application/json', // Establecer el tipo de contenido a JSON
      },
    });
  }
}
