import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioServiceService } from 'src/app/services/usuario-service.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  public formSubmitted = false; // controlar el submit del formulario
  @ViewChild('googleBtn') googleBtn: ElementRef; //referencia al boton

  toggleIcon: boolean = false;
  isMobileMenuOpen: boolean = false;

  public loginForm = this.fb.group({
    email: [
      localStorage.getItem('email'),
      [Validators.required, Validators.email],
    ],
    password: ['', [Validators.required, Validators.minLength(3)]], //modificarlo a 6
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioServiceService,
    private ngZone: NgZone,
    private authService: AuthService
  ) {}

  //para que se renderice el boton de google, despues de un ratito
  ngAfterViewInit(): void {
    this.googleInit();
  }

  ngOnInit(): void {
    localStorage.clear();
  }

  //inicio con GOOGLE
  googleInit() {
    google.accounts.id.initialize({
      client_id:
        '608465346715-dre9926c2jba55t9s0m4gdlpll46kso7.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response),
    });
    google.accounts.id.renderButton(
      this.googleBtn.nativeElement,
      { theme: 'outline', size: 'large' } // customization attributes
    );
  }

  //lama al backend y hace el login o el registro
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

  //LOGIN
  login() {
    this.formSubmitted = true;
    //si no es valido no hacemos nada, solo retornamos
    if (this.loginForm.invalid) {
      return;
    }
    //realizar el posteo
    this.authService.login(this.loginForm.value).subscribe(
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

  //Verificador de formulario
  campoNoValido(campo: string): boolean {
    if (this.loginForm.get(campo).invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  //boton de regresar
  goBack(): void {
    // this.location.back();
    this.router.navigateByUrl('/preLoading');
  }

  //open/close menu-icon
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.toggleIcon = !this.toggleIcon;
    let element = document.getElementById('icon-bars');
    if (this.toggleIcon) {
      element.classList.add('animation');
      element.classList.remove('fa-bars');
      element.classList.add('fas');
      element.classList.add('fa-times');
    } else {
      element.classList.remove('animation');
      element.classList.add('fa-bars');
      element.classList.remove('fas');
      element.classList.remove('fa-times');
    }
  }
}
