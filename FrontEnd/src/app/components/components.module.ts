import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalPasswordComponent } from './modal-password/modal-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalFiltersMapComponent } from './modal-filters-map/modal-filters-map.component';
import { DonationsONGviewComponent } from './donations-ongview/donations-ongview.component';
import { ProfileOngComponent } from '../pages/profile-ong/profile-ong.component';
import { DonatiosVolunteersViewComponent } from './donatios-volunteers-view/donatios-volunteers-view.component';

@NgModule({
  declarations: [ModalPasswordComponent, ModalFiltersMapComponent, DonationsONGviewComponent, DonatiosVolunteersViewComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule,],
  exports: [ModalPasswordComponent, ModalFiltersMapComponent,DonationsONGviewComponent,DonatiosVolunteersViewComponent],
})
export class ComponentsModule {}
