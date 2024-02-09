import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from '../../services/event.service';
import { forkJoin } from 'rxjs';
//

// // import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { UsuarioServiceService } from 'src/app/services/usuario-service.service';
import { map } from 'rxjs/operators';
// // import Swal from 'sweetalert2';
// // import { ModalPasswordService } from 'src/app/services/modal-password.service';
//import { updateFormVoluntario } from 'src/app/interfaces/updateVoluntarioForm.interface';
import { OrganizacionService } from '../../services/organizacion.service';
import { UsuarioServiceService } from 'src/app/services/usuario-service.service';


@Component({
  selector: 'app-cantidad-incriptos-evento-ong',
  templateUrl: './cantidad-incriptos-evento-ong.component.html',
  styleUrls: ['./cantidad-incriptos-evento-ong.component.css']
})
export class CantidadIncriptosEventoOngComponent implements OnInit {
  
  // 
  idParametro;
  evento;
  token;
  usuariosSuscriptions: any = [];
  // newArrayInscriptos: any = [];
  // subscribersWithNames: any[] = []; // Array to hold subscribers with names
  //form: updateFormVoluntario;
  //public updateDataUserForm;
  // uId = this.authService.usuario.uid;
  nameUsuarios: any = [];
  emailUsuarios:any = [];
  nombreEmail: any = [];


  usuarios: any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private eventService: EventService,
    private organizacionService: OrganizacionService,
    //
    private usuarioService: UsuarioServiceService,
    //
    
    // private fb: FormBuilder,
    
    //private usuarioService: UsuarioServiceService,
    
    // public modalPasswordService: ModalPasswordService
  ) {}

  ngOnInit(): void {
    this.idParametro = this.route.snapshot.params['id'];
    console.log('this.idParamentro: ',this.idParametro);
    this.token = this.authService.token;
    
    this.eventService
      .getEventByID(this.token, this.idParametro)
      .subscribe((res: any) => {
        this.evento = res.event;
        
        console.log('res:',res);
        console.log('this.eventos:', this.evento);
        console.log('this.eventos.subscribers:', this.evento.subscribers)

        // contar la cantidad de inscriptos
        // if (this.evento && this.evento.subscribers) {
        //   const cantidadSubscribers = this.evento.subscribers.length;
        //   console.log(`La cantidad de suscriptores es: ${cantidadSubscribers}`);
        // }
        
        
        // Ver si id de un suscriptor esta en el array 
        // const subscriberIdToCheck = "650d1310ad6a16140dbb0b94";

        // if (this.evento && this.evento.subscribers) {
        //     const estaEnSubscribers = this.evento.subscribers.includes(subscriberIdToCheck);

        // if (estaEnSubscribers) {
        //     console.log(`El subscriberId ${subscriberIdToCheck} está en la lista de suscriptores.`);
        // } else {
        //     console.log(`El subscriberId ${subscriberIdToCheck} no está en la lista de suscriptores.`);
        //     console.log(':', this.evento.subscribers.user);
        // }
        // } 


      });

    this.obtenerUsuariosEvento();
    //this.obtenerUsuariosEvento2();
  }

  volverAtras(){
    this.router.navigate(['inicio/mis-eventos-ong']);
  }


  obtenerUsuariosEvento(){
    this.organizacionService.voluntarioByEvent(this.idParametro, this.token)
    .subscribe ((data: any) => {
      
    
      //this.usuariosSuscriptions = data.subscribers.map(subscriber => subscriber.user);
      this.nameUsuarios = data.usersSubscribed.map(usersSubscribed => usersSubscribed.userName);
      this.emailUsuarios = data.usersSubscribed.map(usersSubscribed => usersSubscribed.userEmail);

      console.log('data:',data);
      console.log ('this.usuariosSuscriptions:', this.usuariosSuscriptions)

      // Array de nombres de usuarios
      
      // for (const userId of this.usuariosSuscriptions) {
      //   this.usuarioService.obtenerUsuarioId(userId, this.token).subscribe((userData: any) => {
      //     this.usuarios.push(userData);
      
      // });
      // }
      // console.log('Usuarios:', this.usuarios)
    
    })

  }
  

// obtenerUsuariosEvento() {
//   this.organizacionService.voluntarioByEvent(this.idParametro, this.token)
//     .subscribe((data: any) => {
//       if (data && data.subscribers && Array.isArray(data.subscribers)) {
//         this.usuariosSuscriptions = data.subscribers.map(subscriber => subscriber.user);
        
//         const observables = this.usuariosSuscriptions.map(userId => {
//           return this.usuarioService.obtenerUsuarioId(userId, this.token);
//         });
        
//         // Combinar todas las observables en una sola usando forkJoin
//         forkJoin(observables).subscribe((usuariosData: any[]) => {
//           // Extraer los nombres de los objetos de usuario
//           this.nameUsuarios = usuariosData.map(userData => userData.usuario.name);
//           this.emailUsuarios = usuariosData.map(userData => userData.usuario.email);
          
//           console.log('Nombres de Usuarios:', this.nameUsuarios);
//         });
//       } else {
//         console.log('No se encontraron datos de suscriptores válidos.');
//       }

//       // Convinacion de ambos

//       for (let i = 0; i < this.nameUsuarios.length; i++) {
//         this.nombreEmail.push({
//           nombre: this.nameUsuarios[i],
//           email: this.emailUsuarios[i]
//         });
//       } console.log('combinados:', this.nombreEmail)

//     });


// }



}
