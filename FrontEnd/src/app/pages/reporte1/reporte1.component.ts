import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { OrganizacionService } from '../../services/organizacion.service';
import { Organizations } from 'src/app/interfaces/organizations';
import { UsuarioServiceService } from '../../services/usuario-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reporte1',
  templateUrl: './reporte1.component.html',
  styleUrls: ['./reporte1.component.css']
})
export class Reporte1Component implements OnInit{

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
          startTime : event.startTime,
          state : event.state,
          subscribers: event.subscribers.length,
          porcentajeParticipacion: Math.round((event.subscribers.length / event.maxPeople)* 100),

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
    
    // this.usuarioServiceService
    //   .eventSuscribe(this.id, this.token)
    //   .subscribe((data: any) => {
    //     this.eventosSuscription = data.subscriptions.map(
    //       (subscription) => subscription.event
    //     );
    //     this.IdSuscription = data.subscriptions.map(
    //       (subscription) => subscription._id
    //     );

    //     console.log('data:', data);
    //     console.log('data.event:', data.event);
    //     console.log('this.eventosSuscription:', this.eventosSuscription);
    //     console.log('this.IdSuscriptions:', this.IdSuscription);

        // Nuevo agregado 27/09/2023 (Es para que los eventos se muestren ordenados)

        // Pasa todo lo que tenia el arreglo eventosSuscription a filtredEvents
      //   this.filtredEvents2 = this.eventosSuscription;

      //   // Establece el orden de como se van a ordenar
      //   const stateOrder = ['Proximo a comenzar', 'EnCurso', 'Finalizado'];
      //   this.eventosSuscription.sort((a, b) => {
      //     const stateA = stateOrder.indexOf(a.state);
      //     const stateB = stateOrder.indexOf(b.state);
      //     return stateA - stateB;
      //   });

      //   // Ordena los eventos en this.filtredEvents por estado
      //   this.filtredEvents2.sort((a, b) => {
      //     const stateA = stateOrder.indexOf(a.estado);
      //     const stateB = stateOrder.indexOf(b.estado);
      //     return stateA - stateB;
      //   });
      //   this.loader = true;
      // });
  

  volverAtras(){
    this.router.navigate(['inicio/reportes']);
  }

  downloadPDF2(): void {
    const doc = new jsPDF();

    doc.text('Hello world!', 10, 10);
    doc.save('hello-world.pdf');
  }

  downloadPDF() {
    // Nombre del div que vamos a descargar en PDF
    const DATA = document.getElementById('PDF-Participacion-Eventos-Actual');
    // p: orientacion de la pagina (vertical o horizontal)
    // pt: unidad de medida (puntos)
    // a4: tamaño de la pagina
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      // color de fondo
      background: 'white',
      // escala de la imagen
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      //nombre del archivo que vamos a descargar
      //docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
      docResult.save(`Participacion de todos los eventos publicados(${new Date().toISOString().split("T")[0]})`);
      
    });
  }


}
