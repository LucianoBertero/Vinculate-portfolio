import Swal from 'sweetalert2/src/sweetalert2.js';
import { ModalPasswordService } from 'src/app/services/modal-password.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';

import { Component, EventEmitter } from '@angular/core';
import { ServicesMapFilterService } from 'src/app/services/services-map-filter.service';
import { OrganizacionService } from 'src/app/services/organizacion.service';
import { FiltrosAplicados } from 'src/app/interfaces/filtros-modal';

@Component({
  selector: 'app-modal-filters-map',
  templateUrl: './modal-filters-map.component.html',
  styleUrls: ['./modal-filters-map.component.css'],
})
export class ModalFiltersMapComponent {
  public entitisEvent = [];
  public entitisOng = [];
  dropdownOpen = false;
  dropdownOpenEvent = false;
  selectedOptions = [];
  selectedOptionsEvent = [];
  switchEvent: boolean = true;
  switchOng: boolean = true;

  constructor(
    public servicesMapFilterService: ServicesMapFilterService,
    private organizacionService: OrganizacionService
  ) {}

  ngOnInit(): void {
    this.entitisEvent = this.organizacionService
      .obtenerTipoDeEventos()
      .map((typeEntity) => {
        return { label: typeEntity, selected: false };
      });

    this.entitisOng = this.organizacionService
      .obtenerTipoDeEntidades()
      .map((typeEntity) => {
        return { label: typeEntity, selected: false };
      });

    console.log(
      '🚀 ~ file: modal-filters-map.component.ts:30 ~ ModalFiltersMapComponent ~ ngOnInit ~ this.entitisOng :',
      this.entitisOng
    );
  }

  cerrarModal() {
    this.servicesMapFilterService.cerrarModal();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleOption(option) {
    option.selected = !option.selected;
    this.updateSelectedOptions();
  }

  updateSelectedOptions() {
    this.selectedOptions = this.entitisOng
      .filter((option) => option.selected)
      .map((option) => option.label);
  }

  //evento

  toggleDropdownEvent() {
    this.dropdownOpenEvent = !this.dropdownOpenEvent;
  }

  toggleOptionEvent(option) {
    option.selected = !option.selected;
    this.updateSelectedOptionsEvent();
  }

  updateSelectedOptionsEvent() {
    this.selectedOptionsEvent = this.entitisEvent
      .filter((option) => option.selected)
      .map((option) => option.label);
  }

  resetearVariables() {
    this.entitisEvent = [];
    this.entitisOng = [];
    this.dropdownOpen = false;
    this.dropdownOpenEvent = false;
    this.selectedOptions = [];
    this.selectedOptionsEvent = [];
  }

  aplicarFiltros() {
    let tipoFiltro: 'ong' | 'evento' | 'ambos' | 'ninguno';

    if (this.switchOng && this.switchEvent) {
      tipoFiltro = 'ambos';
    } else if (this.switchOng) {
      tipoFiltro = 'ong';
    } else if (this.switchEvent) {
      tipoFiltro = 'evento';
    } else {
      tipoFiltro = 'ninguno';
    }

    let filtros: FiltrosAplicados = {
      tipoFiltro: tipoFiltro,
      filtrosOng: this.selectedOptions,
      filtrosEvento: this.selectedOptionsEvent,
    };

    this.servicesMapFilterService.filtrosAplicados.emit(filtros);
    this.servicesMapFilterService.cerrarModal();
  }

  eliminarFiltros() {
    const elementosSeleccionados =
      document.querySelectorAll('.option-selected');

    // Itera sobre los elementos y elimina la clase 'option-selected'
    elementosSeleccionados.forEach((elemento) => {
      elemento.classList.remove('option-selected');
    });

    // Además, deselecciona todas las opciones en tu arreglo
    this.entitisEvent.forEach((option) => {
      option.selected = false;
    });
    this.selectedOptions = [];
    this.selectedOptionsEvent = [];
  }
}
