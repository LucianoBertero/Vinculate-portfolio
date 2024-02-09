import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { OrganizacionService } from 'src/app/services/organizacion.service';

@Component({
  selector: 'app-search-events',
  templateUrl: './search-events.component.html',
  styleUrls: ['./search-events.component.css'],
})
export class SearchEventsComponent implements OnInit {
  dropdownOpen = false;
  public options;
  selectedOptions = [];
  events: any = [];
  token;
  public filtredEvents: any = [];
  loader = false;
  eventId: string;

  constructor(
    private router: Router,
    private eventService: EventService,
    private orgService: OrganizacionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    (window as any).navigateToInfoEvent = this.navigateToInfoEvent.bind(this); //para declarar una funcion a nivel globlal
    this.token = this.authService.token;

    this.searchEvents();

    this.options = this.orgService.obtenerTipoDeEventos().map((category) => {
      return { label: category, selected: false };
    });

    console.log(
      '🚀 ~ file: search-events.component.ts:51 ~ SearchEventsComponent ~ this.filtredEvents.sort ~ this.filtredEvents:',
      this.filtredEvents
    );
  }

  searchEvents() {
    this.eventService.getEvents(this.token).subscribe((data: any) => {
      this.events = data.eventos.map((event) => ({
        id: event.uid,
        category: event.category,
        description: event.description,
        name: event.name,
        maxPeople: event.maxPeople,
        estado: event.state,
      }));

      this.filtredEvents = this.events;

      const stateOrder = ['Proximo a comenzar', 'EnCurso', 'Finalizado'];
      this.events.sort((a, b) => {
        const stateA = stateOrder.indexOf(a.state);
        const stateB = stateOrder.indexOf(b.state);
        return stateA - stateB;
      });

      // Ordena los eventos en this.filtredEvents por estado
      this.filtredEvents.sort((a, b) => {
        const stateA = stateOrder.indexOf(a.estado);
        const stateB = stateOrder.indexOf(b.estado);
        return stateA - stateB;
      });
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
      this.filtredEvents = this.events;
      console.log('entro', this.events);
    } else {
      this.filtredEvents = this.events.filter((organizacion) =>
        this.selectedOptions.some(
          (selectedOption) => organizacion.category === selectedOption
        )
      );
    }
    console.log(this.filtredEvents);
  }

  onSearch(searchTerm: string) {
    // Filtra las organizaciones en función del valor de búsqueda
    this.filtredEvents = this.events.filter((organizacion) =>
      organizacion.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (this.selectedOptions.length > 0) {
      // Si hay opciones seleccionadas en los filtros, aplica ese filtro adicional
      this.filtredEvents = this.filtredEvents.filter((organizacion) =>
        this.selectedOptions.some(
          (selectedOption) => organizacion.category === selectedOption
        )
      );
    }

    console.log(this.filtredEvents);
  }

  navigateToInfoEvent(uid: string) {
    this.router.navigate(['/inicio/infoEvent', uid]);
  }

  volverInicio(){
    this.router.navigate(['inicio']);
  }
}
