import { Component, Input, OnInit } from '@angular/core';
import { DonationsONGviewComponent } from '../donations-ongview/donations-ongview.component';
import { DonationsService } from 'src/app/services/donations.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-donatios-volunteers-view',
  templateUrl: './donatios-volunteers-view.component.html',
  styleUrls: ['./donatios-volunteers-view.component.css'],
})
export class DonatiosVolunteersViewComponent implements OnInit {
  @Input() donacionesEjemp;
  public donations: any = [];
  token: string;
  uid: string;
  urlId: string;

  constructor(
    private donationsService: DonationsService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.token = this.authService.token;
    this.uid = this.authService.uid;
    this.urlId = this.route.snapshot.paramMap.get('id');
    this.showDonations();
    console.log(this.donacionesEjemp);
  }

  showDonations() {
    this.donationsService
      .getDonations(this.urlId, this.token)
      .subscribe((data) => {
        if (data && 'donaciones' in data) {
          this.donations = data.donaciones as any[];
        }
      });
  }
}
