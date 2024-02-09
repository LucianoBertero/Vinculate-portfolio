import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Organizations } from 'src/app/interfaces/organizations';
import { OrganizacionService } from 'src/app/services/organizacion.service';

@Component({
  selector: 'app-buscar-organizaciones',
  templateUrl: './buscar-organizaciones.component.html',
  styleUrls: ['./buscar-organizaciones.component.css'],
})
export class BuscarOrganizacionesComponent implements OnInit {
  dropdownOpen = false;
  public options;
  selectedOptions = [];
  organizaciones: Organizations[] = [];
  ongData: any;
  arrayOng: [];
  typeEntities = [];
  loader = false;

  filteredOrganizaciones: Organizations[] = [];

  constructor(
    private orgService: OrganizacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchOrganizations();
    this.typeEntities = this.orgService.obtenerTipoDeEntidades();
    this.options = this.typeEntities.map((typeEntity) => {
      return { label: typeEntity, selected: false };
    });
  }

  searchOrganizations() {
    this.orgService.getOrganizations().subscribe((data) => {
      this.organizaciones = data;
      this.filteredOrganizaciones = data;
      console.log('Datos: ', this.organizaciones);
      this.loader = true;
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleOption(option) {
    option.selected = !option.selected;
    this.updateSelectedOptions();
  }

  updateSelectedOptions() {
    this.selectedOptions = this.options
      .filter((option) => option.selected)
      .map((option) => option.label);

    console.log(this.selectedOptions.length);
    if (this.selectedOptions.length === 0) {
      this.filteredOrganizaciones = this.organizaciones;
      console.log('entro', this.organizaciones);
    } else {
      this.filteredOrganizaciones = this.organizaciones.filter((organizacion) =>
        this.selectedOptions.some(
          (selectedOption) => organizacion.typeEntity === selectedOption
        )
      );
    }
  }

  onSearch(searchTerm: string) {
    // Filtra las organizaciones en función del valor de búsqueda
    this.filteredOrganizaciones = this.organizaciones.filter((organizacion) =>
      organizacion.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (this.selectedOptions.length > 0) {
      // Si hay opciones seleccionadas en los filtros, aplica ese filtro adicional
      this.filteredOrganizaciones = this.filteredOrganizaciones.filter(
        (organizacion) =>
          this.selectedOptions.some(
            (selectedOption) => organizacion.typeEntity === selectedOption
          )
      );
    }

    console.log(this.filteredOrganizaciones);
  }

  verMas(org: any) {
    // Navega al componente de destino y pasa el objeto 'org' como parámetro de ruta
    this.router.navigate(['inicio/profileOng', org.uid]); // Reemplaza 'org.id' con la propiedad adecuada para identificar la organización

    console.log(org);
  }

  volverInicio(){
    this.router.navigate(['inicio']);
  }
}
