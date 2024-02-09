import { Component, OnInit, AfterViewInit } from '@angular/core';
// 
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizacionService } from '../../services/organizacion.service';
import { Organizations } from 'src/app/interfaces/organizations';
import { UsuarioServiceService } from '../../services/usuario-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { environment } from '../../../enviroments/enviroment.prod';
import Swal from 'sweetalert2';

 @Component({
   selector: 'app-mis-eventos-ong',
   templateUrl: './mis-eventos-ong.component.html',
   styleUrls: ['./mis-eventos-ong.component.css']
 })


export class MisEventosOngComponent implements OnInit {
  //
  id: string;
  organization: Organizations;
  token;
  events: any = [];
  selectedOption: string = 'informacion';
  newArrayEvents: any = [];
  selectedEventId: string;

  // Agregado
  public filtredEvents: any = [];
  loader = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private organizacionService: OrganizacionService,
    private authService: AuthService,
    private eventService: EventService
  ) {}

  
  ngOnInit(): void {
    
    this.route.params.subscribe((params) => {
      this.id = this.authService.usuario.uid;
      //const algo = this.eventService.getEventByID(this.token,this.id);
      //console.log ('algo:', algo)
      console.log('Id ong:',this.id)

    });
    console.log(this.id);
    
    this.token = this.authService.token;

    this.organizacionService
      .getOrganizationById(this.id, this.token)
      .subscribe((data: any) => {
        this.organization = data.organizacion;
        console.log(this.organization);
        console.log('entro a this.organizacion')
      });

      this.showEventsOrg();

      
  }

  showEventsOrg() {
    this.selectedOption = 'eventos';
    this.eventService
      .getEventByOrganization(this.token, this.id)
      .subscribe((data: any) => {
        console.log('data eventos:', data.events);
        this.events = data;
        this.newArrayEvents = this.events.eventos.map((event) => ({
          uid: event._id,
          category: event.category,
          description: event.description,
          name: event.name,
          maxPeople: event.maxPeople,
          estado: event.state,
          startDate : event.startDate,
        }));
        console.log('Eventos: ', this.events);
        console.log('Eventos filtrados: ', this.newArrayEvents);
        
        // Nuevo agregado 27/09/2023 (Es para que los eventos se muestren ordenados)
    
        // Pasa todo lo que tenia el arreglo newArrayEvents a filtredEvents
        this.filtredEvents = this.newArrayEvents;
    
        // Establece el orden de como se van a ordenar
        const stateOrder = ['Proximo a comenzar', 'EnCurso', 'Finalizado'];
          this.newArrayEvents.sort((a, b) => {
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

  verCantidadInscriptos(uid: string) {
    this.router.navigate(['inicio/cantidad-inscriptos-eventos-ong', uid]);
  }

  eliminarEvento(name: string, uid: string) {
    

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ml-2',
        cancelButton: 'btn btn-danger ml-2',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `¿Estas seguro que quieres Eliminar el evento"${name}"?`,
        text: 'Tu evento será eliminado, junto con todas sus inscripciones',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          
          console.log('Entro a borrar suscripcion');
          this.eventService
            // .deleteEvent(uid, this.token)
            // .deleteEvent(uid, this.token)
            // .subscribe((res) => {
            //   swalWithBootstrapButtons.fire(
            //     `¡Eliminada!`,
            //     `La Inscirpcion ha sido eliminado con exito`,
            //     'success'
            //   );
              .eliminarEvento(uid)
              .subscribe((res) => {
              swalWithBootstrapButtons.fire(
                `¡Eliminada!`,
                `El evento ha sido eliminado con exito`,
                'success'
                
              );this.showEventsOrg();
              
            });
            
            // swalWithBootstrapButtons.fire(
            //   `¡El evento no pudo ser eliminado!`,
            // ); 
        }
        else if (
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
  


// XD


}
