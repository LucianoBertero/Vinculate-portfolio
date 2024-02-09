import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from '../../services/event.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-info-event',
  templateUrl: './info-event.component.html',
  styleUrls: ['./info-event.component.css'],
})
export class InfoEventComponent implements OnInit {
  idParametro;
  evento;
  token;
  uId;
  btnHide: boolean = false
  public isButtonVisible: boolean = true; // Inicialmente visible
  public isButtonDisabled: boolean = false; // Inicialmente habilitado
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.uId = this.authService.uid;
    this.idParametro = this.route.snapshot.params['id'];
    this.token = this.authService.token;
    console.log('Token: ', this.token);

    this.route.paramMap.subscribe((params) => {
      const uid = params.get('uid');
      if (uid) {
        console.log('UID recibido:', uid);
      }
    });

    this.obtenerEventos();
  }

  obtenerEventos() {
    this.eventService
      .getEventByID(this.token, this.idParametro)
      .subscribe((res: any) => {
        this.evento = res.event;
        console.log('Datos: ', this.evento);

        if (
          this.evento.state === 'EnCurso' ||
          this.evento.state === 'Finalizado'
        ) {
          this.isButtonVisible = false; // Ocultar el botón
        }
        if(this.authService.role === 'ONG_ROLE'){
          this.btnHide = true;
        }

        // Supongamos que tienes acceso a this.evento.maxPeople y this.evento.subscribersCount
        if (this.evento.subscription >= this.evento.maxPeople) {
          this.isButtonDisabled = true; // Deshabilitar el botón
        }
      });
  }
  subscribeVolunteer() {
    this.eventService
      .subscribeEvent(this.token, this.uId, this.idParametro)
      .subscribe(
        (resp) => {
          Swal.fire('Inscripcion registrada', 'success');
          // Navegar al Dashboard
          Swal.fire('Perfecto', 'Te has inscripto correctamente', 'success');
          this.router.navigateByUrl('/login');
        },
        (err) => {
          // Si sucede un error
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
  }

  goBack(): void {
    // this.location.back();
    this.router.navigateByUrl('/inicio');
  }
}
