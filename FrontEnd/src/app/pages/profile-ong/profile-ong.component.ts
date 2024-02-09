import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizacionService } from '../../services/organizacion.service';
import { Organizations } from 'src/app/interfaces/organizations';
import { UsuarioServiceService } from '../../services/usuario-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { DonationsONGviewComponent } from 'src/app/components/donations-ongview/donations-ongview.component';
import { DonatiosVolunteersViewComponent } from 'src/app/components/donatios-volunteers-view/donatios-volunteers-view.component';
import { ModalAddDonationService } from 'src/app/services/modal-add-donation.service';
import { Donations } from 'src/app/interfaces/donations';
import { DonationsService } from 'src/app/services/donations.service';
import { ModifyDonationsService } from 'src/app/services/modify-donations.service';

@Component({
  selector: 'app-profile-ong',
  templateUrl: './profile-ong.component.html',
  styleUrls: ['./profile-ong.component.css'],
})
export class ProfileOngComponent {
  id: string;
  organization;
  token;
  events: any = [];
  selectedOption: string = 'donacion';
  newArrayEvents: any = [];
  cargandoEventos = false;
  newDonations: Donations;
  modifyDonations: Donations;
  role: string;
  donacionesEjemp;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private organizacionService: OrganizacionService,
    private authService: AuthService,
    private eventService: EventService,
    private modalAddDonationsSerice: ModalAddDonationService,
    private modalModifyDonationService: ModifyDonationsService,
    private donationsService: DonationsService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.role;
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
    console.log(this.id);
    this.token = this.authService.token;

    this.organizacionService
      .getOrganizationById(this.id, this.token)
      .subscribe((data: any) => {
        this.organization = data.organizacion;
        console.log(this.organization);
      });

    this.modalAddDonationsSerice.addedDonation.subscribe((data) => {
      this.newDonations = data;
    });

    this.modalModifyDonationService.addedDonation.subscribe((data) => {
      this.modifyDonations = data
    })

    this.getDonations();
  }

  showDonations() {
    this.selectedOption = 'donacion';
  }

  showInformation() {
    this.selectedOption = 'informacion';
  }

  showEventsOrg() {
    this.selectedOption = 'eventos';
    this.eventService
      .getEventByOrganization(this.token, this.id)
      .subscribe((data: any) => {
        console.log(data.events);
        this.events = data;
        this.newArrayEvents = this.events.eventos.map((event) => ({
          category: event.category,
          description: event.description,
          name: event.name,
          maxPeople: event.maxPeople,
          estado: event.state,
          id: event._id,
        }));
        this.cargandoEventos = true;
        const stateOrder = ['Proximo a comenzar', 'EnCurso', 'Finalizado'];
        this.newArrayEvents.sort((a, b) => {
          const stateA = stateOrder.indexOf(a.estado);
          const stateB = stateOrder.indexOf(b.estado);
          return stateA - stateB;
        });

        // Ordena los eventos en this.filtredEvents por estado
        this.events.sort((a, b) => {
          const stateA = stateOrder.indexOf(a.estado);
          const stateB = stateOrder.indexOf(b.estado);
          return stateA - stateB;
        });

        console.log('Eventos: ', this.events);
        console.log('Eventos filtrados: ', this.newArrayEvents);
      });
  }
  verEvento(uid: string) {
    this.router.navigate(['inicio/infoEvent', uid]);
  }

  getDonations() {
    this.donationsService
      .getDonations(this.id, this.token)
      .subscribe((data) => {
        console.log(data);
        if (data && 'donaciones' in data) {
          this.donacionesEjemp = data.donaciones as any[];
          console.log(this.donacionesEjemp);
        }
      });
  }
}
