import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError, delay } from 'rxjs/operators';
import { environment } from '../../enviroments/enviroment';
import { Router } from '@angular/router';
import { RegisterFormOrganizacion } from '../interfaces/register-form-organizacion.interface';

import { newEventForm } from '../interfaces/new-event-form.interface';

import { updateFormOrganization } from '../interfaces/updateOrganizationForm.interface';
import { Usuario } from '../models/usuario.model';
import { AuthService } from './auth.service';

import { Organizations } from '../interfaces/organizations';
import { Donations } from '../interfaces/donations';

const base_url = environment.base_url;
declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class OrganizacionService {
  constructor(private http: HttpClient, private router: Router) {}

  crearOrganizacion(
    form: RegisterFormOrganizacion,
    file: File,
    coordenadas: any,
    howToGet: string
  ) {
    console.log(form);
    const url = `http://localhost:3000/api/organizacion`;
    const formData = new FormData();
    formData.append('cuit', form.cuit);
    formData.append('image', file);
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('password', form.password);
    formData.append('phone', form.phone);
    formData.append('description', form.description);
    formData.append('personInCharge', form.personInCharge);
    formData.append('typeEntity', form.typeEntity);
    formData.append('lat', coordenadas.lat);
    formData.append('lng', coordenadas.lng);
    formData.append('howToGet', howToGet);
    formData.append('cbu', form.cbu);
    formData.append('alias', form.alias);

    return this.http.post(url, formData);
  }

  obtenerTipoDeEntidades() {
    return [
      'Hogares de acogida para niños',
      'Comedores comunitarios',
      'Comedores comunitarios',
      'Bancos de alimentos',
      'Centros de atención y apoyo a personas sin hogar',
      'Centros de rehabilitación para adictos',
      'Programas de apoyo a la educación de niños y jóvenes en riesgo',
      'Centros de atención a víctimas de violencia doméstica',
      'Organizaciones de ayuda a personas mayores',
      'Centros de capacitación laboral para personas en situación de vulnerabilidad',
      'Organizaciones de promoción y protección de los derechos de la infancia',
      'Otro',
    ];
  }

  obtenerTipoDeEventos() {
    return [
      'Maratones o carreras solidarias',
      'Subastas benéficas',
      'Eventos de recaudación de fondos',
      'Eventos deportivos benéficos',
      'Eventos solidarios de voluntariado',
      'Campañas de donación',
      'Ferias solidarias',
      'Conferencias o charlas solidarias',
      'Eventos culturales benéficos',
      'Eventos de sensibilización',
      'Evento de reciclaje',
      'Otro',
    ];
  }

  createEvent(
    form: newEventForm,
    uId: string,
    token: string,
    coordenadas: any
  ) {
    console.log('Datos del formulario', form);

    const url = `${base_url}/evento/${uId}`;

    console.log(url);

    const startDate = this.formatDate(form['startDate'].toString());
    const endDate = this.formatDate(form['finishDate'].toString());

    const requestBody = {
      name: form['name'],
      category: form['typeEntity'],

      startDate: startDate,
      // startTime: form['startHour'].toString(),
      startTime: form['startHour'],
      endDate: endDate,
      // endTime: form['finishHour'].toString(),
      endTime: form['finishHour'],
      description: form['description'],
      requirements: form['requirements'],
      lat: coordenadas.lat,
      lng: coordenadas.lng,
      howToGet: form['howToGet'],
      maxPeople: form['maxPeople'],
    };

    console.log('hasta aca entro');
    console.log(requestBody);

    return this.http.post(url, requestBody, {
      headers: {
        'x-token': token,
      },
    });
  }

  getOrganizationByName(name: string, token: string) {
    const url = `http://localhost:3000/api/organizacion/${name}`;
    console.log('URL: ', url);

    return this.http.get(url, {
      headers: {
        'x-token': token,
      },
    });
  }

  getOrganizationById(uId: string, token: string) {
    const url = `http://localhost:3000/api/organizacion/id/${uId}`;
    console.log('URL: ', url);

    return this.http.get(url, {
      headers: {
        'x-token': token,
      },
    });
  }

  getOrganizations() {
    const url = 'http://localhost:3000/api/organizacion';

    return this.http.get<any[]>(url).pipe(
      map((response: any) => {
        // Mapea la respuesta y extrae solo el array de organizaciones
        return response.organizaciones as Organizations[];
      })
    );
  }

  deleteOng(id: string, token: string) {
    const url = `http://localhost:3000/api/organizacion/${id}`;
    return this.http.delete(url, {
      headers: {
        'x-token': token,
      },
    });
  }

  updateDataOrganization(
    form: updateFormOrganization,
    uId: string,
    token: string,
    imageUPD: File
  ) {
    const url = `${base_url}/organizacion/${uId}`;
    console.log(uId);

    const formData = new FormData();

    console.log(imageUPD);

    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('typeEntity', form.typeEntity);
    formData.append('personInCharge', form.personInCharge);
    formData.append('phone', form.phone);
    formData.append('description', form.description);
    formData.append('cuit', form.cuit);
    formData.append('location', form.location);
    formData.append('img', imageUPD);

    return this.http.put(url, formData, {
      headers: {
        'x-token': token,
      },
    });
  }

  // getEventsById(uId: string, token: string) {
  //   const url = `http://localhost:3000/api/eventos/id/${uId}`;
  //   console.log('URL: ', url);

  //   return this.http.get(url, {
  //     headers: {
  //       'x-token': token,
  //     },
  //   });
  // }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Agrega un cero inicial si el mes es menor a 10
    const day = date.getDate().toString().padStart(2, '0'); // Agrega un cero inicial si el día es menor a 10

    return `${year}/${month}/${day}`;
  }


  // getScurptorByEvent(uId: string, token: string) {
  //   const url = `/:organizacionId/:eventoId/voluntarios/${uId}`;
  //   console.log('URL: ', url);

  //   return this.http.get(url, {
  //     headers: {
  //       'x-token': token,
  //     },
  //   });
  // }

  // Dado un Id de Evento te trae todos los usuarios suscriptos
  voluntarioByEvent(id: string, token: string) {
    const url = `http://localhost:3000/api/evento/${id}/voluntarios`;
    
    return this.http.get(url, {
      headers: {
        'x-token': token,
      },
    });
  }

  getPendingONG() {
    const url = 'http://localhost:3000/api/organizacion/getOrganizationsApprove';

    return this.http.get(url);
  }

  putApproved(uId:string, token:string) {
    const url = `${base_url}/organizacion/actualizarRolOng/${uId}`;
    console.log("URL DEL PUT: ",url)

    const body = {
      permissions: 'APPROVED'
    }

    return this.http.put(url, body, {
      headers: {
        'x-token': token,
      },
    });
  }

  putRefused(uId:string, token:string) {
    const url = `${base_url}/organizacion/actualizarRolOng/${uId}`;
    console.log("URL DEL PUT: ",url)

    const body = {
      permissions: 'REFUSED'
    }

    return this.http.put(url, body, {
      headers: {
        'x-token': token,
      },
    });
  }

  
}

  
