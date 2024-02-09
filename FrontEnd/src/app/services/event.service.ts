import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class EventService {
  
  // private apiUrl = 'http://localhost:3000/api/evento/eliminarEvento';

  constructor(private http: HttpClient) {}

  getEventByID(token: string, uid: string) {
    const url = `${base_url}/evento/${uid}`;
    console.log('URL: ', url);
    console.log('Base URL:', base_url);

    return this.http.get(url, {
      headers: {
        'x-token': token,
      },
    });
  }

  getEventByOrganization(token: string, uid: string) {
    const url = `${base_url}/organizacion/organizationEvents/${uid}`;
    console.log('URL: ', url);

    return this.http.get(url, {
      headers: {
        'x-token': token,
      },
    });
  }

  getEvents(token: string) {
    const url = `${base_url}/evento`;
    console.log('URL: ', url);

    return this.http.get(url, {
      headers: {
        'x-token': token,
      },
    });
  }

  subscribeEvent(token: string, uid: string, eId: string) {
    const url = `${base_url}/subscription/${uid}`;

    const requestBody = {
      eventId: eId,
    };

    return this.http.post(url, requestBody, {
      headers: {
        'x-token': token,
      },
    });
  }

  deleteSuscription(
    idUsuario: string,
    token: string,
    idSucription: string,
    idEvent: string
  ) {
    // "/:id/:subscription/:eventId"
    const url = `http://localhost:3000/api/subscription/${idUsuario}/${idSucription}/${idEvent}`;
    console.log('entro a delete suscription en servicio');
    return this.http.delete(url, {
      headers: {
        'x-token': token,
      },
    });
  }

  //  deleteEvent(idEvent: string, token: string) {
  //    const url = `http://localhost:3000/api/evento/eliminarEvento`;
  //    console.log('entro a delete event en servicio');
    
  //    return this.http.delete(url, {
  //      headers: {
  //        'x-token': token,
  //      },
  //    });
  //  }

   eliminarEvento(idEvent: string) {
    const url = `http://localhost:3000/api/evento/eliminarEvento`;
    
    // Puedes pasar el ID del evento como parámetro de la solicitud
    const options = {
      body: { idEvent: idEvent }
    };
  
    return this.http.delete(url, options);
  }

  // }

  // deleteEvent(idEvent: string) {

    
  //   const body = { idEvent };

  //   return this.http.delete(`${this.apiUrl}/${idEvent}`, { body });

  // }

  

  // deleteEvent(idEvent: string) {

    
  //   const response = await fetch('http://tu-servidor.com/api/eliminarEvento', {
  //     method: 'DELETE',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ idEvent: idEvent }),
  //   });

  //   // return this.http.delete(`${this.apiUrl}/${idEvent}`, { body });

  

  }
