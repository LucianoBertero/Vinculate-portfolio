import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { ProfileOngComponent } from 'src/app/pages/profile-ong/profile-ong.component';
import { AuthService } from 'src/app/services/auth.service';
import { DonationsService } from 'src/app/services/donations.service';
import { ModalAddDonationService } from 'src/app/services/modal-add-donation.service';
import { ModifyDonationsService } from 'src/app/services/modify-donations.service';
import { OrganizacionService } from 'src/app/services/organizacion.service';
import Swal from 'sweetalert2';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-donations-ongview',
  templateUrl: './donations-ongview.component.html',
  styleUrls: ['./donations-ongview.component.css'],
})
export class DonationsONGviewComponent implements OnInit {
  @Input() donacionesEjemp: any = [];
  addDonationsForm: FormGroup;
  modifyDonationsForm: FormGroup;
  donationsType = [];
  token: string;
  uid: string;
  urlId: string;
  isMyONG: boolean = false;
  public formSubmittedDonations = false;
  public donations: any = [];
  state: string;
  stateDelete: string = 'Eliminar';
  statePause: string = 'Pausar';
  stateResume: string = 'Reanudar';
  duId: string;
  selectedDonation: any
  donations$: Observable<any[]>;
  donationsRnd$: Observable<any[]>;

  constructor(
    public modalAddDonationsSerice: ModalAddDonationService,
    public modalModifyDonations: ModifyDonationsService,
    private formBuilder: FormBuilder,
    private organizacionService: OrganizacionService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private donationsService: DonationsService
  ) {}

  ngOnInit() {
    
    this.token = this.authService.token;
    this.uid = this.authService.uid;
    this.urlId = this.route.snapshot.paramMap.get('id');
    this.createForm();
    this.createFormModify()
    this.donationsType = this.donationsService.getTypeDonations();
    this.validateUser();
    this.showDonations();
    
    this.donations$ = this.donationsService.getDonations(this.urlId, this.token).pipe(
      map((data: any) => data.donaciones as any[]),
      map((donations: any[]) => donations.filter(d => d.state === 'Pausar'))
    );
    this.donationsRnd$ = this.donationsService.getDonations(this.urlId, this.token).pipe(
      map((data: any) => data.donaciones as any[]),
      map((donations: any[]) => donations.filter(d => d.state !== 'Pausar'))
    );

    console.log("Donations$", this.donations$);
  }

  createForm() {
    this.addDonationsForm = this.formBuilder.group({
      title: ['', Validators.required],
      typeDonation: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  createFormModify() {
    this.modifyDonationsForm = this.formBuilder.group({
      title: ['', Validators.required],
      typeDonation: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  registerDonation() {
    this.formSubmittedDonations = true;
    console.log('Entro a register donation');
    if(this.addDonationsForm.valid){
      this.donationsService
      .createDonation(this.addDonationsForm.value, this.uid, this.token)
      .subscribe(
        (resp) => {
          Swal.fire({ text: 'Donacion registrada con exito', icon: 'success' });
          this.cerrarModal();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
        (err) => {
          // Si sucede un error
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
    } else {
      Swal.fire('Complete todos los campos', 'Revise los campos', 'error');
    }
    
  }

  updateDonation(){
    this.formSubmittedDonations = true;
    if(this.modifyDonationsForm.valid){
      this.donationsService.putDonation(this.modifyDonationsForm.value, this.uid, this.token, this.selectedDonation._id ,this.state).subscribe((resp) => {
        Swal.fire({text: 'Donacion modificada con exito', icon: 'success'});
        this.closeModifyDonations();
        this.cerrarModal();
            setTimeout(() => {
              window.location.reload();
            }, 3000);
      },
      (err) => {
        // Si sucede un error
        Swal.fire('Error', err.error.msg, 'error');
      }
      );
    } else {
      Swal.fire('Complete todos los campos', 'Revise los campos', 'error');
    }
    
  }

  deleteDonation(){
    this.donationsService.putDonation(this.modifyDonationsForm.value, this.uid, this.token, this.selectedDonation._id ,this.stateDelete).subscribe((resp) => {
      console.log("RESPUESTAA: ", resp)
      Swal.fire({text: 'Donacion eliminada con exito', icon: 'success'});
      this.closeModifyDonations();
      this.cerrarModal();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
    },
    (err) => {
      // Si sucede un error
      Swal.fire('Error', err.error.msg, 'error');
    }
    );
  }

  pauseDonation() {
    this.donationsService.putDonation(this.modifyDonationsForm.value, this.uid, this.token, this.selectedDonation._id ,this.statePause).subscribe((resp) => {
      console.log("RESPUESTAA: ", resp)
      Swal.fire({text: 'Donacion Pausada con exito', icon: 'success'});
      this.closeModifyDonations();
      this.cerrarModal();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
    },
    (err) => {
      // Si sucede un error
      Swal.fire('Error', err.error.msg, 'error');
    }
    );
  }

  resumeDonation() {
    this.donationsService.putDonation(this.modifyDonationsForm.value, this.uid, this.token, this.selectedDonation._id ,this.stateResume).subscribe((resp) => {
      console.log("RESPUESTAA: ", resp)
      Swal.fire({text: 'Donacion Reanudada con exito', icon: 'success'});
      this.closeModifyDonations();
      this.cerrarModal();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
    },
    (err) => {
      // Si sucede un error
      Swal.fire('Error', err.error.msg, 'error');
    }
    );
  }
  

  addDonations() {
    this.modalAddDonationsSerice.abrirModal();
  }

  cerrarModal() {
    this.modalAddDonationsSerice.cerrarModal();
  }

  openModifyDonations(donation: any) {
    this.modalModifyDonations.abrirModal();
    this.modifyDonationsForm.setValue({
      title: donation.title || '',
      typeDonation: donation.typeDonation || '',
      description: donation.description || '',
    });
    this.selectedDonation = donation;
    
  }

  closeModifyDonations() {
    this.modalModifyDonations.cerrarModal();
  }




  validateUser() {
    console.log('URLID: ', this.urlId);
    console.log('uid: ', this.uid);
    if (this.urlId === this.uid) {
      this.isMyONG = true;
    } else {
      this.isMyONG = false;
    }
  }

  campoNoValidoDonacion(campo: string): boolean {
    if (
      this.addDonationsForm?.get(campo).invalid &&
      this?.formSubmittedDonations
    ) {
      return true;
    } else {
      return false;
    }
  }

  campoNoValidoModifyDonacion(campo: string): boolean {
    if (
      this.modifyDonationsForm?.get(campo).invalid &&
      this?.formSubmittedDonations
    ) {
      return true;
    } else {
      return false;
    }
  }

  showDonations() {
    
    this.donationsService
      .getDonations(this.urlId, this.token)
      .subscribe((data) => {
        if (data && 'donaciones' in data) {
          this.donations = data.donaciones as any[];
          console.log("DONACIONESSSS: ", this.donations)
        }
      });
  }

  // searchEvents() {
  //   this.eventService.getEvents(this.token).subscribe((data: any) => {
  //     this.events = data.eventos.map((event) => ({
  //       id: event.uid,
  //       category: event.category,
  //       description: event.description,
  //       name: event.name,
  //       maxPeople: event.maxPeople,
  //       estado: event.state,
  //     }));
}
