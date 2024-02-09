import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioServiceService } from 'src/app/services/usuario-service.service';
import Swal from 'sweetalert2';
declare const google: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  public token: string;
  public enSesion: boolean = false;
  public menu: any[];
  public invitado = false;
  public accountSettingURL: string;
  public myProfileONG: string
  public uid:string
  public urlId:string

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.uid = this.authService.uid
    const token = localStorage.getItem('token');
    if (token === null) {
      this.menu = ['INVITADO'];
      this.invitado = true;
    } else {
      this.enSesion = true;
      if (this.authService.usuario.role === 'USER_ROLE') {
        this.menu = ['USER_ROLE', 'ORGANIZACION', 'NOTIFICACION'];
        this.accountSettingURL = './accountSettingsVoluntario';
      }
      if (this.authService.usuario.role === 'ONG_ROLE') {
        this.menu = ['ONG_ROLE', 'ADMINISTRAR', 'NOTIFICACION'];
        this.accountSettingURL = './accountSettingsONG';
        this.myProfileONG = `./profileOng/${this.uid}`
      }
      if (this.authService.usuario.role === 'ADMIN_ROLE') {
        this.menu = ['ADMIN_ROLE', 'ADMIN', 'NOTIFICACION'];
      }
    }
  }

  logOut() {
    Swal.fire({
      title: 'Usted esta seguro de cerrar Sesion?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#06d79c',
      cancelButtonColor: '#2f3d4a',
      confirmButtonText: 'Si, salir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Cuenta Cerrada!', 'Su sesion fue cerrada', 'success');
        this.authService.logout();
      }
    });
  }

  inicio() {
    this.router.navigateByUrl('/login');
  }

  myProfile() {
      setTimeout(() => {
        window.location.reload();
      }, 1);  
  }
}
