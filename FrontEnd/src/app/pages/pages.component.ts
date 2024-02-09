import { Component, HostListener, OnDestroy } from '@angular/core';
import { InactivityService } from '../services/inactivity.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioServiceService } from '../services/usuario-service.service';
import { AuthService } from '../services/auth.service';
import { SidebarService } from '../services/sidebar.service';

declare function customInitFunction();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css'],
})
export class PagesComponent implements OnDestroy {
  private logoutTimer: ReturnType<typeof setTimeout>;

  private readonly INACTIVE_TIMEOUT = 180000000; // 10 segundos

  private token = localStorage.getItem('token');
  constructor(
    private router: Router,
    private AuthService: AuthService,
    private sideBarService: SidebarService
  ) {}

  ngOnInit() {
    // Iniciar el temporizador cuando el usuario inicia sesión
    customInitFunction();
    this.sideBarService.cargarMenu();
    if (this.token !== null) {
      console.log('entro');
      this.resetLogoutTimer();
    }
    console.log(this.AuthService.usuario);
  }

  ngOnDestroy() {
    // Limpiar el temporizador al salir del componente
    clearTimeout(this.logoutTimer);
  }

  @HostListener('document:click')
  @HostListener('document:keypress')
  onInteraction() {
    if (this.token !== null) {
      console.log('Aumtento de poder');
      this.resetLogoutTimer();
    }
  }

  resetLogoutTimer() {
    clearTimeout(this.logoutTimer);
    console.log('entroa redireccionamiento');
    this.logoutTimer = setTimeout(
      () => this.logoutAndRedirect(),
      this.INACTIVE_TIMEOUT
    );
  }

  logoutAndRedirect() {
    // Realiza la lógica para cerrar la sesión aquí, por ejemplo, haciendo una solicitud al servidor o borrando las cookies.
    localStorage.clear();
    // Redirecciona al usuario a la página de inicio de sesión
    this.router.navigate(['/login']);
    Swal.fire('Su sesion se ha agotado, inicie de nuevo');
  }
}
