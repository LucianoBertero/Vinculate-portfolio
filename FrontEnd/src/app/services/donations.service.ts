import { Injectable } from '@angular/core';
import { Donations } from '../interfaces/donations';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class DonationsService {

  base_url = environment.base_url;
  donations: any[] = [];

  constructor(
    private http: HttpClient
  ) { }

  getTypeDonations() {
    return [
      'Alimentos no perecederos.',
      'Ropa nueva o en buen estado.',
      'Juguetes para niños.',
      'Artículos de higiene personal (cepillos de dientes, champú, jabón, etc.).',
      'Suministros escolares (lápices, cuadernos, mochilas, etc.).',
      'Productos de limpieza del hogar.',
      'Libros para bibliotecas o escuelas.',
      'Muebles en buen estado.',
      'Equipamiento deportivo.',
      'Sillas de ruedas o dispositivos de movilidad.',
      'Productos para bebés (pañales, fórmula infantil, biberones, etc.).',
      'Suministros médicos (vendas, medicamentos no caducados, etc.).',
      'Mantas y sacos de dormir para personas sin hogar.',
      'Material de construcción para proyectos de viviendas.',
      'Arte y material de manualidades para proyectos educativos.',
      'Equipos electrónicos usados (computadoras, tabletas, etc.).',
      'Gafas o lentes usados en buen estado.',
      'Sillas de ruedas o dispositivos de movilidad.',
      'Donaciones monetarias para organizaciones benéficas.',
      'Tiempo y voluntariado en organizaciones sin fines de lucro.'
    ];
  }

  createDonation(form: Donations, uId: string, token:string) {

    const url = `${this.base_url}/organizacion/donation/${uId}`;

    console.log("URLLL: ",url)

     const requestBody = {
      title: form['title'],
      typeDonation: form['typeDonation'],
      description: form['description'],
    };

    console.log('hasta aca entro');
    console.log("Body donacion: ",requestBody);

    return this.http.post(url, requestBody, {
      headers: {
        'x-token': token,
      },
    });
  }


  getDonations(id: string, token:string) {
    const url = `${this.base_url}/organizacion/donation/${id}`;
    
    return this.http.get(url, {
      headers: {
        'x-token': token,
      },
    });
  }

  putDonation(form: Donations, uId: string, token:string, duId: string, state: string) {

    const url = `${this.base_url}/organizacion/donation/changeState/${uId}/${duId}`;


    console.log("URLLL: ",url)

     const requestBody = {
      title: form['title'],
      typeDonation: form['typeDonation'],
      description: form['description'],
      nuevoEstado: state
    };

    console.log("Body donacion: ",requestBody);

    return this.http.put(url, requestBody, {
      headers: {
        'x-token': token,
      },
    });
  }
}

