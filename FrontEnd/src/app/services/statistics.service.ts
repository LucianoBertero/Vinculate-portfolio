import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private http: HttpClient) {}

  getStaticsUsers(token: string) {
    const url = `${base_url}/statistics/users`;
    return this.http.get(url, {
      headers: {
        'x-token': token,
      },
    });
  }

  getpageViewStatistics(token: string, mes?: number, anio?: number) {
    const url = `${base_url}/statistics/pageViewStatistics`;

    // Construir los query parameters
    const queryParams: { [key: string]: string } = {};
    if (mes !== undefined) {
      queryParams['mes'] = mes.toString();
    }
    if (anio !== undefined) {
      queryParams['anio'] = anio.toString();
    }

    return this.http.get(url, {
      headers: {
        'x-token': token,
      },
      params: queryParams, // Pasar los query parameters en la solicitud GET
    });
  }
}
