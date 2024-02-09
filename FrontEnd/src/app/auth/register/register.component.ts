///<reference path="../../../../node_modules/@types/googlemaps/index.d.ts"/>
import {
  Component,
  ElementRef,
  NgZone,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UsuarioServiceService } from 'src/app/services/usuario-service.service';
import Swal from 'sweetalert2';
import { OrganizacionService } from '../../services/organizacion.service';
import { AuthService } from 'src/app/services/auth.service';
declare const google: any;
//TODO hacer que se registren las organizaciones

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnChanges {
  mapa!: google.maps.Map;
  marker: google.maps.Marker | null = null;
  distancia!: string;
  formMapas!: FormGroup;
  confirmar = false;
  ubication = '';
  selectedMap: boolean = false;
  latitude: number;
  longitude: number;
  coordenadas: { lat: number; lng: number };
  @ViewChild('divMap') divMap!: ElementRef;
  @ViewChild('inputPlaces') inputPlaces!: ElementRef;

  public opcionSeleccionada = 'organizacion';
  public formSubmittedVoluntario = false;
  public formSubmittedOrganizacion = false;
  public sumbitted = false;
  toggleIcon: boolean = false;
  isMobileMenuOpen: boolean = false;
  public registerFormOrganizacion;
  public registerFormVoluntario;
  public imagenSubir: File;
  public tiposDeOng = [];
  registerUbication: boolean = false;
  public howToGet = '';
  confirmoUbicacion = false;
  markerValidation: number;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioServiceService,
    public router: Router,
    private organizacionService: OrganizacionService,
    private ngZone: NgZone,
    private authService: AuthService,
    private renderer: Renderer2
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  @ViewChild('googleBtn') googleBtn: ElementRef | undefined; //referencia al boton

  ngAfterViewInit(): void {
    this.googleInit();

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
  googleInit() {
    if (this.googleBtn) {
      // Verificar si this.googleBtn no es undefined
      google.accounts.id.initialize({
        client_id:
          '608465346715-dre9926c2jba55t9s0m4gdlpll46kso7.apps.googleusercontent.com',
        callback: (response: any) => this.handleCredentialResponse(response),
      });
      google.accounts.id.renderButton(this.googleBtn.nativeElement, {
        theme: 'outline',
        size: 'large',
      });
    }
  }

  handleCredentialResponse(response: any) {
    console.log(response);
    this.authService.loginGoogle(response.credential).subscribe((resp) => {
      this.ngZone.run(() => {
        // Código de la operación asincrónica aquí
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
        Toast.fire({
          icon: 'success',
          title: 'Inicio Satistfactorio',
        });
        this.router.navigateByUrl('/inicio');
      });
    });
  }
  loginGoogle() {
    this.formSubmittedVoluntario = true;
    //si no es valido no hacemos nada, solo retornamos
    if (this.registerFormVoluntario.invalid) {
      return;
    }
    //realizar el posteo
    this.authService.login(this.registerFormVoluntario.value).subscribe(
      // this.usuarioService.login(this.loginForm.value).subscribe(
      (resp) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: 'success',
          title: 'Inicio Satistfactorio',
        }); // Navegar al Dashboard
        this.router.navigateByUrl('/inicio');
      },
      (err) => {
        // Si sucede un error
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  ngOnInit(): void {
    this.markerValidation = 1;
    this.construirFormularios();
    this.tiposDeOng = this.organizacionService.obtenerTipoDeEntidades();
  }

  construirFormularios() {
    this.registerFormVoluntario = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password2: ['', [Validators.required, Validators.minLength(6)]],
      },
      {
        validators: this.passwordsIguales('password', 'password2'),
      }
    );

    this.registerFormOrganizacion = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(3)]],
        password2: ['', [Validators.required, Validators.minLength(3)]],
        description: ['', Validators.required],
        typeEntity: ['', Validators.required],
        phone: ['', [Validators.required, Validators.minLength(6)]],
        personInCharge: ['', Validators.required],
        cuit: ['', [Validators.minLength(10), Validators.required]],
        image: [''],
        lat: [''],
        lng: [''],
        howToGet: [''],
        ubication: [''],
        cbu: [''],
        alias: [''],
      },
      {
        validators: this.passwordsIguales('password', 'password2'),
      }
    );
  }
  campoNoValidoVoluntario(campo: string): boolean {
    if (
      this.registerFormVoluntario?.get(campo).invalid &&
      this?.formSubmittedVoluntario
    ) {
      return true;
    } else {
      return false;
    }
  }

  //aun no se usa pero no borrar
  contrasenasNoValidasVoluntario() {
    const pass1 = this.registerFormVoluntario.get('password').value;
    const pass2 = this.registerFormVoluntario.get('password2').value;

    if (pass1 !== pass2 && this.formSubmittedVoluntario) {
      return true;
    } else {
      return false;
    }
  }

  campoNoValidoOrganizacion(campo: string): boolean {
    if (
      this.registerFormOrganizacion?.get(campo).invalid &&
      this?.formSubmittedOrganizacion
    ) {
      return true;
    } else {
      return false;
    }
  }

  tipoDeOrganizacionNoValida() {
    if (
      this.registerFormOrganizacion?.get('typeEntity').invalid &&
      this?.formSubmittedOrganizacion
    ) {
      return true;
    } else {
      return false;
    }
  }

  imagenNoSeleccionada() {
    if (this.imagenSubir === undefined && this?.formSubmittedOrganizacion) {
      return true;
    } else {
      return false;
    }
  }

  registrarVoluntario() {
    console.log('entro al registro voluntario');
    this.formSubmittedVoluntario = true;

    if (this.opcionSeleccionada === 'voluntario') {
      if (this.registerFormVoluntario.invalid) {
        return;
      }

      this.registrarNuevoUsuario();
    }
  }

  registrarOrganizacion() {
    this.formSubmittedOrganizacion = true;

    if (this.opcionSeleccionada === 'organizacion') {
      if (this.registerFormOrganizacion.invalid) {
        return;
      }
      this.registrarNuevaOrganizacion();
    }
  }

  registrarNuevoUsuario() {
    this.usuarioService
      .crearUsuario(this.registerFormVoluntario.value)
      .subscribe(
        (resp) => {
          Swal.fire(
            'Usuario Registrado',
            'Su usuario ya se encuentra registrado',
            'success'
          );
          // Navegar al Dashboard
          Swal.fire(
            'Perfecto',
            'Su usuario ya fue registrado inicie sesion',
            'success'
          );
          this.router.navigateByUrl('/login');
        },
        (err) => {
          // Si sucede un error
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
  }

  registrarNuevaOrganizacion() {
    if (this.imagenSubir === undefined) {
      return;
    }
    if (!this.confirmoUbicacion) {
      this.coordenadas = { lat: 0, lng: 0 };
      this.howToGet = '';
    }

    this.organizacionService
      .crearOrganizacion(
        this.registerFormOrganizacion.value,
        this.imagenSubir,
        this.coordenadas,
        this.howToGet
      )
      .subscribe(
        (resp) => {
          Swal.fire(
            'Organizacion pendiente de aprobacion',
            'Se les confirmara',
            'success'
          );
          // Navegar al Dashboard

          this.router.navigateByUrl('/login');
        },
        (err) => {
          // Si sucede un error
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
  }

  cambiarImagen(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const maxSize = 50 * 1024; // Tamaño máximo en bytes (50 KB)

      // Verificar el tamaño del archivo
      if (file.size > maxSize) {
        // Mostrar un mensaje de error o realizar alguna acción adecuada
        console.log('El tamaño del archivo excede el límite permitido');
        this.imagenSubir = undefined;
        return;
      }

      // Verificar el tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        // Mostrar un mensaje de error o realizar alguna acción adecuada
        console.log('El formato del archivo no es válido');
        this.imagenSubir = undefined;
        return;
      }
      this.imagenSubir = file;
    }
  }

  passwordsIguales(pass1Name: string, pass2Name: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ noEsIgual: true });
        pass1Control.setErrors({ noEsIgual: true });
      }
    };
  }

  login() {}

  addRegisterUbication() {
    this.sumbitted = !this.sumbitted;
    this.registerUbication = !this.registerUbication;
    //reseteo de bariables
    this.confirmoUbicacion = false;
    this.coordenadas = { lat: 0, lng: 0 };
    this.howToGet = '';
  }
  onSelectChange() {
    this.registerUbication = false;
    this.markerValidation === 1;
  }

  confirmationRegisterUbication() {
    this.sumbitted = !this.sumbitted;
    //verificar que ingrese coordenadas y el how to get este completado
    console.log('MARCADOR: ', this.markerValidation);
    if (
      this.coordenadas === undefined ||
      this.howToGet === '' ||
      this.markerValidation === 1
    ) {
      Swal.fire('Complete todos los campos y seleccione una ubicacion');
      return;
    }
    this.confirmoUbicacion = true;
    this.registerUbication = !this.registerUbication;
  }

  goLogin(): void {
    this.router.navigateByUrl('/login');
  }

  campoNoValidoEvento(campo: string): boolean {
    if (
      this.registerFormOrganizacion?.get(campo).invalid &&
      this?.formSubmittedVoluntario
    ) {
      return true;
    } else {
      return false;
    }
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
      this.markerValidation += 1;

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

  private cargarAutocomplete() {
    console.log(this.inputPlaces.nativeElement);
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

  agregarMarcador(latLng: google.maps.LatLng) {
    if (this.marker) {
      this.marker.setMap(null);
    }
    this.marker = new google.maps.Marker({
      position: latLng,
      map: this.mapa,
    });
  }
}
