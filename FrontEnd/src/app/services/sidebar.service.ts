import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  public menu = [];

  constructor(private authService: AuthService) {}

  cargarMenu() {
    console.log(this.authService.usuario);
    const token = localStorage.getItem('token');
    if (token === null) {
      this.menu = [
        {
          titulo: 'INVITADO',

          submenu: [
            { titulo: 'Buscar Organizaciones', url: 'buscarOrganizaciones' },
            { titulo: 'Buscar Eventos', url: '' },
            { titulo: 'COSA 3', url: '' },
            { titulo: 'COSA 4', url: 'promesas' },
            { titulo: 'COSA 5', url: 'progress' },
          ],
        },
      ];
    } else {
      if (this.authService.usuario.role === 'USER_ROLE') {
        this.menu = [
          {
            titulo: 'Organizaciones',

            submenu: [
              { titulo: 'Buscar Organizaciones', url: 'buscarOrganizaciones' },
            ],
          },
          {
            titulo: 'Eventos',

            submenu: [
              { titulo: 'Buscar Eventos', url: 'buscarEventos' },
              { titulo: 'Mis Eventos', url: 'mis-eventos-voluntario' },
            ],
          },
        ];
      }
      if (this.authService.usuario.role === 'ONG_ROLE') {
        this.menu = [
          {
            titulo: 'Gestionar Evento',

            submenu: [
              { titulo: 'Buscar Eventos', url: 'buscarEventos' },
              { titulo: 'Registrar Evento', url: 'registrarEvento' },
              { titulo: 'Mis Eventos Publicados', url: 'mis-eventos-ong' },
              { titulo: 'Reporte de Eventos', url: 'reportes' },
            ],
            // },
            // {
            //   titulo: 'TITULO 2',

            //   submenu: [
            //     { titulo: 'Buscar Organizaciones', url: 'prueba' },
            //     { titulo: 'Buscar Eventos', url: '' },
            //     { titulo: 'COSA 3', url: '' },
            //     { titulo: 'COSA 4', url: 'promesas' },
            //     { titulo: 'COSA 5', url: 'progress' },
            //   ],
          },
          {
            titulo: 'Organizaciones',

            submenu: [
              { titulo: 'Buscar Organizaciones', url: 'buscarOrganizaciones' },
            ],
            // },
            // {
            //   titulo: 'TITULO 2',

            //   submenu: [
            //     { titulo: 'Buscar Organizaciones', url: 'prueba' },
            //     { titulo: 'Buscar Eventos', url: '' },
            //     { titulo: 'COSA 3', url: '' },
            //     { titulo: 'COSA 4', url: 'promesas' },
            //     { titulo: 'COSA 5', url: 'progress' },
            //   ],
          },
        ];
      }
      if (this.authService.usuario.role === 'ADMIN_ROLE') {
        this.menu = [
          {
            titulo: 'Administracion',

            submenu: [
              { titulo: 'Buscar Organizaciones', url: 'buscarOrganizaciones' },
              { titulo: 'Buscar Eventos', url: 'buscarEventos' },
              { titulo: 'Estadisticas', url: 'estadisticas' },
              { titulo: 'Aprobar ONG', url: 'aprobarONG' },
            ],
          },
        ];
      }
    }
  }
}
// menu: any[] = [
//   {
//     titulo: 'Dashboard',
//     icono: 'mdi mdi-gauge',
//     submenu: [
//       { titulo: 'Main', url: '/' },
//       { titulo: 'Gráficas', url: 'grafica1' },
//       { titulo: 'rxjs', url: 'rxjs' },
//       { titulo: 'Promesas', url: 'promesas' },
//       { titulo: 'ProgressBar', url: 'progress' },
//     ]
//   },]
