import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Prueba1Component } from './prueba1/prueba1.component';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../components/components.module';
import { PrincipioComponent } from './principio/principio.component';
import { Prueba2Component } from './prueba2/prueba2.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RegistrarEventoComponent } from './registrar-evento/registrar-evento.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AcountSettingONGComponent } from './acount-setting-ong/acount-setting-ong.component';
import { AccuntSettingsVoluntarioComponent } from './accunt-settings-voluntario/accunt-settings-voluntario.component';
import { BrowserModule } from '@angular/platform-browser';
import { BuscarOrganizacionesComponent } from './buscar-organizaciones/buscar-organizaciones.component';
import { ProfileOngComponent } from './profile-ong/profile-ong.component';

import { PageMapComponent } from './page-map/page-map.component';
import { InfoEventComponent } from './info-event/info-event.component';
import { SearchEventsComponent } from './search-events/search-events.component';

import { MisEventosVoluntarioComponent } from './mis-eventos-voluntario/mis-eventos-voluntario.component';

import { MisEventosOngComponent } from './mis-eventos-ong/mis-eventos-ong.component';
import { CantidadIncriptosEventoOngComponent } from './cantidad-incriptos-evento-ong/cantidad-incriptos-evento-ong.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';

import { ApprovedONGComponent } from './approved-ong/approved-ong.component';

import { ReportesComponent } from './reportes/reportes.component';
import { Reporte1Component } from './reporte1/reporte1.component';
import { Reporte2Component } from './reporte2/reporte2.component';


@NgModule({
  declarations: [
    PagesComponent,
    Prueba1Component,
    PrincipioComponent,
    Prueba2Component,

    RegistrarEventoComponent,

    AcountSettingONGComponent,
    AccuntSettingsVoluntarioComponent,

    BuscarOrganizacionesComponent,
    ProfileOngComponent,

    PageMapComponent,
    InfoEventComponent,
    SearchEventsComponent,

    MisEventosVoluntarioComponent,

    MisEventosOngComponent,
    CantidadIncriptosEventoOngComponent,
    EstadisticasComponent,

    ApprovedONGComponent,

    ReportesComponent,
    Reporte1Component,
    Reporte2Component,

  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule,
    ComponentsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    BrowserModule,
  ],
  providers: [DatePipe],

  exports: [PagesComponent, PrincipioComponent, Prueba2Component, ProfileOngComponent],

})
export class PagesModule {}
