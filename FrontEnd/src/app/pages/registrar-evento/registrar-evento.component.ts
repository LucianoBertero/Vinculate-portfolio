///<reference path="../../../../node_modules/@types/googlemaps/index.d.ts"/>
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { OrganizacionService } from '../../services/organizacion.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/models/usuario.model';
import { ElementRef, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { map } from 'rxjs';
import { Location } from '@angular/common';
import { compileNgModule } from '@angular/compiler';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-registrar-evento',
  templateUrl: './registrar-evento.component.html',
  styleUrls: ['./registrar-evento.component.css'],
})
export class RegistrarEventoComponent implements OnInit {
  newEventForm: FormGroup;
  typeOfEvent = [];
  usuario: Usuario;
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
  confirmar = false;

  constructor(
    private formBuilder: FormBuilder,
    private organizacionService: OrganizacionService,
    private router: Router,
    private authService: AuthService,
    private renderer: Renderer2,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.crearFormulario();
    this.typeOfEvent = this.organizacionService.obtenerTipoDeEventos();
    this.usuario = this.authService.usuario;
    console.log(this.usuario);
    this.token = this.authService.token;
    this.formatearFecha();
    console.log(this.currentDate);
  }

  crearFormulario() {
    this.newEventForm = this.formBuilder.group({
      name: ['', Validators.required],
      typeEntity: ['', Validators.required],
      maxPeople: ['', Validators.required],
      startDate: ['', Validators.required],
      startHour: ['', Validators.required],
      finishDate: ['', Validators.required],
      finishHour: ['', Validators.required],
      ubication: ['', Validators.required],
      howToGet: ['', [Validators.required, Validators.minLength(30)]],
      description: ['', [Validators.required, Validators.minLength(30)]],
      requirements: ['', [Validators.required, Validators.minLength(30)]],
    });
  }

  postNewEvent() {
    let startDate = this.newEventForm.get('startDate').value;
    let finishDate = this.newEventForm.get('finishDate').value;
    console.log(this.usuario.uid);
    this.formSubmittedEvent = true;
    console.log('Datos del form: ', this.newEventForm.value);
    console.log(this.coordenadas);

    if (
      this.newEventForm.valid &&
      (this.coordenadas != undefined || this.selectedMap) &&
      startDate <= finishDate &&
      startDate != null &&
      finishDate != null
    ) {
      this.organizacionService
        .createEvent(
          this.newEventForm.value,
          this?.usuario.uid,
          this.token,
          this.coordenadas
        )
        .subscribe(
          (resp) => {
            Swal.fire({ text: 'Evento publicado con exito', icon: 'success' });

            this.router.navigateByUrl('/inicio');
          },
          (err) => {
            // Si sucede un error
            Swal.fire('Error', err.error.msg, 'error');
          }
        );
    } else {
      alert('Revisar datos del formulario');
    }
  }

  formatearFecha() {
    const fechaFormateada = this.datePipe.transform(
      this.currentDate,
      'yyyy-MM-dd'
    );
    return fechaFormateada;
  }

  DatesValidator() {
    const startDate = this.newEventForm.get('startDate').value;
    const finishDate = this.newEventForm.get('finishDate').value;

    if (startDate > finishDate && this.formSubmittedEvent) {
      return true;
    }
    if ((startDate === '' || finishDate === '') && this.formSubmittedEvent) {
      return true;
    }

    return false;
  }

  formatearHora() {
    const currentHour = new Date();
    const hora = currentHour.getHours() * 3600;
    const minutos = currentHour.getMinutes() * 60;
    const horaFormateada = hora + minutos;

    return horaFormateada;
  }

  hoursValidator() {
    const startHour = this.newEventForm.get('startHour').value;
    const finishHour = this.newEventForm.get('finishHour').value;
    const startDate = this.newEventForm.get('startDate').value;
    const finishDate = this.newEventForm.get('finishDate').value;

    const [hourStart, minuteStart] = startHour.split(':');
    const totalSecondsStart =
      parseInt(hourStart) * 3600 + parseInt(minuteStart) * 60;

    const [hourFinish, minuteFinish] = finishHour.split(':');
    const totalSecondsFinish =
      parseInt(hourFinish) * 3600 + parseInt(minuteFinish) * 60;

    if ((startHour === '' || finishHour === '') && this.formSubmittedEvent) {
      return true;
    }

    if (totalSecondsStart < this.formatearHora() && this.formSubmittedEvent) {
      return (this.hourValidator = !this.hourValidator);
    }

    if (
      totalSecondsStart > totalSecondsFinish &&
      this.formSubmittedEvent &&
      startDate === finishDate
    ) {
      return (this.hourValidator = !this.hourValidator);
    } else {
      return (this.hourValidator = false);
    }
  }

  goBack(): void {
    // this.location.back();
    this.router.navigateByUrl('/inicio');
  }

  campoNoValidoEvento(campo: string): boolean {
    if (this.newEventForm?.get(campo).invalid && this?.formSubmittedEvent) {
      return true;
    } else {
      return false;
    }
  }

  //aca vamos a poner lo de mapa

  ngAfterViewInit(): void {
    const opciones = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log(position);
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
        console.log(position);

        await this.cargarMapa(position);
        this.cargarAutocomplete();
      },
      null,
      opciones
    );
    //nuevo

    // ...
  }

  private cargarAutocomplete() {
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
      console.log('el place completo es:', place);

      this.mapa.setCenter(place.geometry.location);
      if (this.marker) {
        this.marker.setMap(null); // Elimina el marcador anterior si existe
      }

      this.marker = new google.maps.Marker({
        position: place.geometry.location,
        map: this.mapa,
      });
      this.coordenadas = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      console.log(this.coordenadas);
      this.marker.setMap(this.mapa);
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
    console.log('entro');
    this.mapa = new google.maps.Map(
      this.renderer.selectRootElement(this.divMap.nativeElement),
      opciones
    );

    // a partir de aca se hace cuando se ejecuta el click
    this.mapa.addListener('click', (event) => {
      this.selectedMap = true;
      this.agregarMarcador(event.latLng);
      this.newEventForm.get('ubication').setValue('');
      this.newEventForm.get('ubication').setErrors(null);
      this.coordenadas = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      console.log(this.coordenadas);
    });

    this.agregarMarcador(
      new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      )
    );
  }

  agregarMarcador(latLng: google.maps.LatLng) {
    // Eliminar marcador existente, si lo hay
    if (this.marker) {
      this.marker.setMap(null);
    }

    // Crear un nuevo marcador en la posición especificada
    this.marker = new google.maps.Marker({
      position: latLng,
      map: this.mapa,
    });

    // Otros ajustes o acciones adicionales que desees realizar con el marcador
    // ...
  }
}
