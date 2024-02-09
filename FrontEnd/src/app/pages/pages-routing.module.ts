import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { Prueba1Component } from './prueba1/prueba1.component';
import { AuthGuardGuard } from '../guards/auth-guard.guard';
import { ProteccionInicioGuard } from '../guards/proteccion-inicio.guard';
import { PrincipioComponent } from './principio/principio.component';
import { Prueba2Component } from './prueba2/prueba2.component';

import { RegistrarEventoComponent } from './registrar-evento/registrar-evento.component';

import { AcountSettingONGComponent } from './acount-setting-ong/acount-setting-ong.component';
import { AccuntSettingsVoluntarioComponent } from './accunt-settings-voluntario/accunt-settings-voluntario.component';

import { BuscarOrganizacionesComponent } from './buscar-organizaciones/buscar-organizaciones.component';

import { PageMapComponent } from './page-map/page-map.component';
import { InfoEventComponent } from './info-event/info-event.component';
import { ProfileOngComponent } from './profile-ong/profile-ong.component';
import { SearchEventsComponent } from './search-events/search-events.component';

import { MisEventosVoluntarioComponent } from './mis-eventos-voluntario/mis-eventos-voluntario.component';

import { MisEventosOngComponent } from './mis-eventos-ong/mis-eventos-ong.component';
import { CantidadIncriptosEventoOngComponent } from './cantidad-incriptos-evento-ong/cantidad-incriptos-evento-ong.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';

import { ApprovedONGComponent } from './approved-ong/approved-ong.component';

import { ReportesComponent } from './reportes/reportes.component';
import { Reporte1Component } from './reporte1/reporte1.component';
import { Reporte2Component } from './reporte2/reporte2.component';


const routes: Routes = [
  {
    path: 'inicio',
    component: PagesComponent,
    canActivate: [AuthGuardGuard], //ACORDARSE DE ACTIVAR
    children: [
      { path: '', component: PageMapComponent },
      { path: 'registrarEvento', component: RegistrarEventoComponent },
      { path: 'prueba2', component: Prueba2Component },
      { path: 'accountSettingsONG', component: AcountSettingONGComponent },
      { path: 'infoEvent/:id', component: InfoEventComponent },
      {
        path: 'accountSettingsVoluntario',
        component: AccuntSettingsVoluntarioComponent,
      },
      {
        path: 'buscarOrganizaciones',
        component: BuscarOrganizacionesComponent,
      },
      { path: 'profileOng/:id', component: ProfileOngComponent },

      { path: 'buscarEventos', component: SearchEventsComponent },

      {
        path: 'mis-eventos-voluntario',
        component: MisEventosVoluntarioComponent,
      },

      { path: 'mis-eventos-ong', component: MisEventosOngComponent },
      {
        path: 'cantidad-inscriptos-eventos-ong/:id',
        component: CantidadIncriptosEventoOngComponent,
      },
      { path: 'estadisticas', component: EstadisticasComponent },

      { path: 'aprobarONG', component: ApprovedONGComponent },

      { path: 'reportes', component: ReportesComponent },
      { path: 'reporte1', component: Reporte1Component },
      { path: 'reporte2', component: Reporte2Component },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
