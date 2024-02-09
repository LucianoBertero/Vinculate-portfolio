import { Component, OnInit } from '@angular/core';
//
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizacionService } from '../../services/organizacion.service';
import { Organizations } from 'src/app/interfaces/organizations';
import { UsuarioServiceService } from '../../services/usuario-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-eventos-voluntario',
  templateUrl: './mis-eventos-voluntario.component.html',
  styleUrls: ['./mis-eventos-voluntario.component.css'],
})
export class MisEventosVoluntarioComponent implements OnInit {
  //
  id: string;
  organization: Organizations;
  token;
  events: any = [];
  selectedOption: string = 'informacion';
  newArrayEvents: any = [];
  eventosSuscription: any = [];
  IdSuscriptions: any = [];

  public filtredEvents: any = [];
  loader = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private organizacionService: OrganizacionService,
    private authService: AuthService,
    private eventService: EventService,
    private usuarioServiceService: UsuarioServiceService
  ) {}

  ngOnInit(): void {
    this.id = this.authService.uid;
    console.log(this.id);

    this.token = this.authService.token;

    this.organizacionService
      .getOrganizationById(this.id, this.token)
      .subscribe((data: any) => {
        this.organization = data.organizacion;
        console.log(this.organization);
        console.log('entro a this.organizacion');
      });
    // this.showEventsOrg();
    this.obtenerInscripciones();
  }

  obtenerInscripciones() {
    this.usuarioServiceService
      .eventSuscribe(this.id, this.token)
      .subscribe((data: any) => {
        this.eventosSuscription = data.subscriptions.map(
          (subscription) => subscription.event
        );
        this.IdSuscriptions = data.subscriptions.map(
          (subscription) => subscription._id
        );

        console.log('data:', data);
        console.log('data.event:', data.event);
        console.log('this.eventosSuscription:', this.eventosSuscription);
        console.log('this.IdSuscriptions:', this.IdSuscriptions);

        // Nuevo agregado 27/09/2023 (Es para que los eventos se muestren ordenados)

        // Pasa todo lo que tenia el arreglo eventosSuscription a filtredEvents
        this.filtredEvents = this.eventosSuscription;

        // Establece el orden de como se van a ordenar
        const stateOrder = ['Proximo a comenzar', 'EnCurso', 'Finalizado'];
        this.eventosSuscription.sort((a, b) => {
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

  verCantidadInscriptos() {
    this.router.navigate(['inicio/mis-eventos-voluntario']);
  }

  // XD

  borrarSuscription(name: string, idEvento: string, idSucription: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ml-2',
        cancelButton: 'btn btn-danger ml-2',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `¿Estas seguro que quieres desincribirte de ${name}?`,
        text: 'Tu inscripcion será eliminada',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          // Agregar metodo para eliminar la suscripcion
          // Poner el mensaje dentro del metodo
          console.log('Entro a borrar suscripcion');
          this.eventService
            .deleteSuscription(this.id, this.token, idSucription, idEvento)
            .subscribe((res) => {
              swalWithBootstrapButtons.fire(
                `¡Eliminada!`,
                `La Inscirpcion ha sido eliminado con exito`,
                'success'
              );
              this.obtenerInscripciones();
            });

          // this.usuarioService
          //   .deleteVoluntario(this.uId, this.token)
          //   .subscribe((res) => {
          //     this.authService.logout();
          //   });
          // this.authService.logout()
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            '¡Cancelado!',
            'Tu Inscripcion sigue avtiva',
            'error'
          );
        }
      });
  }

  volverInicio() {
    this.router.navigate(['inicio']);
  }
}
