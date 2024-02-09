import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class MapServicesService {
  constructor(private http: HttpClient) {}

  getPointsMapEvent(token: string) {
    const url = `${base_url}/utilities/mapcoordinatesEvent`;
    console.log('URL: ', url);

    return this.http.get(url, {
      headers: {
        'x-token': token,
      },
    });
  }
  getPointsMapOng(token: string) {
    const url = `${base_url}/utilities/mapcoordinatesOng`;
    console.log('URL: ', url);

    return this.http.get(url, {
      headers: {
        'x-token': token,
      },
    });
  }
}
