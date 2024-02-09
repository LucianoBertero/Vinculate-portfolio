///<reference path="../../../../node_modules/@types/googlemaps/index.d.ts"/>
import {
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
  OnInit,
} from '@angular/core';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { MapServicesService } from 'src/app/services/map-services.service';
import { OrganizacionService } from 'src/app/services/organizacion.service';
import { AuthService } from '../../services/auth.service';
import { ServicesMapFilterService } from 'src/app/services/services-map-filter.service';
import { FiltrosAplicados } from 'src/app/interfaces/filtros-modal';
import { ProfileOngComponent } from '../profile-ong/profile-ong.component';

@Component({
  selector: 'app-page-map',
  templateUrl: './page-map.component.html',
  styleUrls: ['./page-map.component.css'],
})
export class PageMapComponent implements OnInit {
  infowindow: google.maps.InfoWindow | null = null;
  search: FormGroup;
  dropdownOpen = false;
  public options;
  selectedOptions = [];
  organizaciones: [] = [];
  ongData: any;
  arrayOng: [];
  typeEntities = [];

  typeOfEvent = [];

  token: string;
  formSubmittedEvent: boolean = false;
  latitude: number;
  longitude: number;
  coordenadas: { lat: number; lng: number };
  dateValidator: boolean = false;
  hourValidator: boolean = false;
  currentDate: Date = new Date();
  selectedMap: boolean = false;

  @ViewChild('divMap') divMap!: ElementRef;
  @ViewChild('inputPlaces') inputPlaces!: ElementRef;

  mapa!: google.maps.Map;
  marker: google.maps.Marker | null = null;
  distancia!: string;
  formMapas!: FormGroup;

  eventPoint: any;
  marcadores: google.maps.Marker[] = [];
  marcadoresFiltrados: google.maps.Marker[] = [];
  organizacionesMarcadores: google.maps.Marker[] = [];

  marcadoresOng: google.maps.Marker[] = [];
  marcadoresFiltradosOng: google.maps.Marker[] = [];

  filtros: FiltrosAplicados;

  constructor(
    private orgService: OrganizacionService,
    private router: Router,
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    private mapService: MapServicesService,
    private authService: AuthService,

    private serviceMapFilterModal: ServicesMapFilterService
  ) {}

  ngOnInit(): void {
    (window as any).navigateToInfoEvent = this.navigateToInfoEvent.bind(this); //para declarar una funcion a nivel globlal
    (window as any).navigateToProfileOng = this.navigateToProfileOng.bind(this); //para declarar una funcion a nivel globlal
    this.crearFormulario();
    this.typeEntities = this.orgService.obtenerTipoDeEventos();
    this.typeEntities.push(this.orgService.obtenerTipoDeEntidades());

    this.serviceMapFilterModal.filtrosAplicados.subscribe((filtros) => {
      (this.filtros = filtros), this.actualizarMapaConFiltros();
    });

    this.token = this.authService.token;

    this.mapService
      .getPointsMapEvent(this.token)
      .subscribe((respuesta: any) => {
        this.eventPoint = respuesta;

        for (const organizacion in respuesta.eventosPorOrganizacion) {
          if (respuesta.eventosPorOrganizacion.hasOwnProperty(organizacion)) {
            const eventosDeOrganizacion =
              respuesta.eventosPorOrganizacion[organizacion];

            // Ahora puedes recorrer los eventos de esta organización y extraer las coordenadas
            for (const organizacion in respuesta.eventosPorOrganizacion) {
              if (
                respuesta.eventosPorOrganizacion.hasOwnProperty(organizacion)
              ) {
                const eventosDeOrganizacion =
                  respuesta.eventosPorOrganizacion[organizacion];

                // Recorrer los eventos de esta organización y agregar marcadores
                for (const evento of eventosDeOrganizacion) {
                  const coordenadas = evento.coordinates;
                  const lat = coordenadas.lat;
                  const lng = coordenadas.lng;
                  const titulo = evento.name; // Puedes personalizar el título aquí

                  const contenidoHtml = `
                <h2 class="text-center">${evento.name}</h2></br>
                <h3 class="text-center">${evento.category}</h3>
                <h4 class="text-center">${evento.requirements}</h4>
                <button type="button" class=" col-12 btn btn-primary mr-2 m-t-15 m-b-5" onclick="navigateToInfoEvent('${evento.uid}')">Ver evento!</button>

              `;

                  // Agregar el marcador a la lista de marcadores
                  this.agregarMarcador(
                    new google.maps.LatLng(lat, lng),
                    evento.category,
                    contenidoHtml,
                    evento.category,
                    false
                  );
                }
              }
            }
          }
        }
      });

    this.mapService.getPointsMapOng(this.token).subscribe((respuesta: any) => {
      for (const organizacion of respuesta.organizationsWithCoordinates) {
        const contenidoHtml = `
          <h2 class="text-center">${organizacion.name}</h2></br>
          <h3 class="text-center">${organizacion.typeEntity}</h3>
          <h4 class="text-center">${organizacion.description}</h4>
          <button type="button" class="col-12 btn btn-primary mr-2 m-t-15 m-b-5" onclick="navigateToProfileOng('${organizacion.uid}')">Ver organizacion!</button>

        `;

        // Obtén las coordenadas de la organización (supongamos que están en latitud y longitud)
        const lat = organizacion.coordinates.lat;
        const lng = organizacion.coordinates.lng;
        this.agregarMarcador(
          new google.maps.LatLng(lat, lng),
          organizacion.typeEntity,
          contenidoHtml,
          organizacion.category,
          true
        );
        // Crea un marcador para la organización

        // Agrega el marcador al arreglo de organizacionesMarcadores
      }
    });
  }

  actualizarMapaConFiltros() {
    if (this.filtros.tipoFiltro === 'ambos') {
      if (
        this.filtros.filtrosOng.length === 0 &&
        this.filtros.filtrosEvento.length === 0
      ) {
        let marcadoresFiltrados = [...this.marcadoresOng, ...this.marcadores];
        this.loadFilteredBookmarks(marcadoresFiltrados);
      } else if (
        this.filtros.filtrosOng.length > 0 &&
        this.filtros.filtrosEvento.length === 0
      ) {
        let marcadoresFiltrados = this.marcadoresOng.filter((marcador) =>
          this.filtros.filtrosOng.some(
            (selectedOption) => marcador.getTitle() === selectedOption
          )
        );

        this.loadFilteredBookmarksOng(marcadoresFiltrados);
      } else if (
        this.filtros.filtrosOng.length === 0 &&
        this.filtros.filtrosEvento.length > 0
      ) {
        // Caso 3: Solo el array de Eventos tiene elementos

        let marcadoresFiltrados = this.marcadores.filter((marcador) =>
          this.filtros.filtrosEvento.some(
            (selectedOption) => marcador.getTitle() === selectedOption
          )
        );

        this.loadFilteredBookmarksEvent(marcadoresFiltrados);
      } else if (
        this.filtros.filtrosOng.length > 0 &&
        this.filtros.filtrosEvento.length > 0
      ) {
        let marcadoresFiltradosOng = this.marcadoresOng.filter((marcador) =>
          this.filtros.filtrosOng.some(
            (selectedOption) => marcador.getTitle() === selectedOption
          )
        );

        let marcadoresFiltradosEvento = this.marcadores.filter((marcador) =>
          this.filtros.filtrosEvento.some(
            (selectedOption) => marcador.getTitle() === selectedOption
          )
        );
        let marcadoresFiltrados = [
          ...marcadoresFiltradosOng,
          ...marcadoresFiltradosEvento,
        ];
        this.loadFilteredBookmarks(marcadoresFiltrados);
      }
    }

    if (this.filtros.tipoFiltro === 'evento') {
      if (this.filtros.filtrosEvento.length === 0) {
        this.loadFilteredBookmarks(this.marcadores);
      } else if (this.filtros.filtrosEvento.length > 0) {
        // Solo el array de ONG tiene elementos
        // Lógica para mostrar solo ONG
        let marcadoresFiltrados = this.marcadores.filter((marcador) =>
          this.filtros.filtrosEvento.some(
            (selectedOption) => marcador.getTitle() === selectedOption
          )
        );

        this.loadFilteredBookmarks(marcadoresFiltrados);
      }
    }

    if (this.filtros.tipoFiltro === 'ong') {
      // Verifica si ambos arrays tienen elementos
      if (this.filtros.filtrosOng.length === 0) {
        this.loadFilteredBookmarks(this.marcadoresOng);
      } else if (this.filtros.filtrosOng.length > 0) {
        let marcadoresFiltrados = this.marcadoresOng.filter((marcador) =>
          this.filtros.filtrosOng.some(
            (selectedOption) => marcador.getTitle() === selectedOption
          )
        );

        this.loadFilteredBookmarks(marcadoresFiltrados);
      }
    }

    if (this.filtros.tipoFiltro === 'ninguno') {
      let marcadoresFiltrados = [...this.marcadoresOng, ...this.marcadores];
      this.loadFilteredBookmarks(marcadoresFiltrados);
    }
  }

  updateSelectedOptions() {
    this.selectedOptions = this.options
      .filter((option) => option.selected)
      .map((option) => option.label);

    if (this.selectedOptions.length === 0) {
      // Si no se ha seleccionado ninguna opción, muestra todos los marcadores
      this.marcadoresFiltrados = this.marcadores;
    } else {
      // Filtra los marcadores según las opciones seleccionadas
      this.marcadoresFiltrados = this.marcadores.filter((marcador) =>
        this.selectedOptions.some(
          (selectedOption) => marcador.getTitle() === selectedOption
        )
      );
    }

    this.loadFilteredBookmarks(this.marcadoresFiltrados);
  }

  loadFilteredBookmarks(marcadoresFiltrados) {
    for (const marcador of this.marcadores) {
      marcador.setMap(null);
    }
    console.log(this.marcadoresOng);
    for (const marcador of this.marcadoresOng) {
      marcador.setMap(null);
    }
    for (const nuevoMarcador of marcadoresFiltrados) {
      nuevoMarcador.setMap(this.mapa);
    }
  }
  loadFilteredBookmarksOng(marcadoresFiltrados) {
    for (const marcador of this.marcadoresOng) {
      marcador.setMap(null);
    }
    for (const nuevoMarcador of this.marcadores) {
      nuevoMarcador.setMap(this.mapa);
    }
    for (const nuevoMarcador of marcadoresFiltrados) {
      nuevoMarcador.setMap(this.mapa);
    }
  }
  loadFilteredBookmarksEvent(marcadoresFiltrados) {
    for (const marcador of this.marcadores) {
      marcador.setMap(null);
    }

    for (const nuevoMarcador of this.marcadoresOng) {
      nuevoMarcador.setMap(this.mapa);
    }
    for (const nuevoMarcador of marcadoresFiltrados) {
      nuevoMarcador.setMap(this.mapa);
    }
  }

  crearFormulario() {
    this.search = this.formBuilder.group({
      ubication: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    const opciones = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await this.cargarMapa(position);
          this.cargarAutocomplete();
        },
        null,
        opciones
      );
    } else {
      console.log('navegador no compatible');
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await this.cargarMapa(position);
        this.cargarAutocomplete();
      },
      null,
      opciones
    );
    //nuevo

    // ...
  }
  navigateToInfoEvent(uid: string) {
    // Aquí puedes navegar a la página de información del evento
    // Usando el enrutador de Angular y pasando el ID del evento como parámetro
    this.router.navigate(['/inicio/infoEvent', uid]);
  }

  navigateToProfileOng(uid: string) {
    // Aquí puedes navegar a la página de información del evento
    // Usando el enrutador de Angular y pasando el ID del evento como parámetro
    this.router.navigate(['/inicio/profileOng', uid]);
  }

  //Ciudad de Córdoba
  // Place ID: ChIJaVuPR1-YMpQRkrBmU5pPorA
  // Ciudad de Córdoba, Provincia de Córdoba, Argentina

  private cargarAutocomplete() {
    this.inputPlaces.nativeElement;

    const autocomplete = new google.maps.places.Autocomplete(
      this.renderer.selectRootElement(this.inputPlaces.nativeElement),
      {
        componentRestrictions: {
          country: ['AR'],
        },
        fields: ['address_components', 'geometry'],
        types: ['address'],
      }
    );
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place: any = autocomplete.getPlace();

      this.mapa.setCenter(place.geometry.location);
      if (this.marker) {
        this.marker.setMap(null); // Elimina el marcador anterior si existe
      }

      this.marker = new google.maps.Marker({
        position: place.geometry.location,
        map: this.mapa,
      });
    });
  }

  cargarMapa(position: any): any {
    const opciones = {
      center: new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      ),
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    this.mapa = new google.maps.Map(
      this.renderer.selectRootElement(this.divMap.nativeElement),
      opciones
    );
    this.mapa.addListener('click', (event) => {});

    // a partir de aca se hace cuando se ejecuta el click
  }

  agregarMarcador(
    latLng: google.maps.LatLng,
    title: string,
    contenidoHtml: string,
    tipoEntity: string,
    ong: boolean
  ) {
    let customMarkerSymbol;

    if (ong) {
      customMarkerSymbol = {
        path: 'M 0,0 30,0 30,30 0,30 Z', // Path que representa un cuadrado
        fillColor: this.cambiarColorDelMarcador(title),
        fillOpacity: 1,
        strokeColor: 'transparent',
        scale: 1, // Puedes ajustar el tamaño según tus preferencias
      };
    } else {
      customMarkerSymbol = {
        path: 'M 0,2 2,-2 -2,-2 Z', // Path que representa un triángulo
        fillColor: this.cambiarColorDelMarcador(tipoEntity), // Cambia esto al color que desees
        fillOpacity: 1,
        strokeColor: 'transparent', // Esto elimina el borde
        scale: 10, // Cambia el tamaño del símbolo según tus preferencias
      };
    }

    const marker = new google.maps.Marker({
      position: latLng,
      map: this.mapa,
      title: title,
      icon: customMarkerSymbol,
    });

    // Agregar un evento de clic al marcador para mostrar la ventana de información
    marker.addListener('click', () => {
      if (this.infowindow) {
        this.infowindow.close();
      }

      const infoWindow = new google.maps.InfoWindow({
        content: contenidoHtml,
      });

      // Abre la ventana de información en el mapa
      infoWindow.open(this.mapa, marker);
      this.infowindow = infoWindow;
    });

    // Agregar el nuevo marcador a la lista de marcadores
    if (ong) {
      this.marcadoresOng.push(marker);
    } else {
      this.marcadores.push(marker);
    }
  }

  cambiarColorDelMarcador(tipoEntidad: string): string {
    // Define los colores para cada tipo de entidad en un switch
    switch (tipoEntidad) {
      case 'Hogares de acogida para niños':
        return 'blue';

      case 'Comedores comunitarios':
        return 'green';

      case 'Bancos de alimentos':
        return 'orange';

      case 'Centros de atención y apoyo a personas sin hogar':
        return 'purple';

      case 'Centros de rehabilitación para adictos':
        return 'pink';

      case 'Programas de apoyo a la educación de niños y jóvenes en riesgo':
        return 'brown';

      case 'Centros de atención a víctimas de violencia doméstica':
        return 'gray';

      case 'Organizaciones de ayuda a personas mayores':
        return 'violet';

      case 'Centros de capacitación laboral para personas en situación de vulnerabilidad':
        return 'cyan';

      case 'Organizaciones de promoción y protección de los derechos de la infancia':
        return 'magenta';

      case 'Maratones o carreras solidarias':
        return 'gold';

      case 'Subastas benéficas':
        return 'silver';

      case 'Eventos de recaudación de fondos':
        return 'bold';

      case 'Eventos deportivos benéficos':
        return 'teal';

      case 'Eventos solidarios de voluntariado':
        return 'pink';

      case 'Campañas de donación':
        return 'black';

      case 'Ferias solidarias':
        return 'orange';

      case 'Conferencias o charlas solidarias':
        return 'lime';

      case 'Eventos culturales benéficos':
        return 'blue';

      case 'Eventos de sensibilización':
        return 'teal';

      case 'Evento de reciclaje':
        return 'lime';

      case 'Otro':
        return 'gray';

      default:
        return 'red'; // Color predeterminado para otros tipos
    }
  }

  aplicarFiltros() {
    this.serviceMapFilterModal.abrirModal();
  }
}
