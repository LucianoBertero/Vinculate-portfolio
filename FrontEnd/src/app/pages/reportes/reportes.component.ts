import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {
  
  constructor(
    private router: Router,
    // private eventService: EventService,
    // private orgService: OrganizacionService,
    // private authService: AuthService
  ) {}
  
  ngOnInit(): void {}

  navigateVerMas1() {
    // this.router.navigate(['/inicio/infoEvent', uid]);
    this.router.navigate(['/inicio/reporte1']);
  }

  navigateVerMas2() {
    // this.router.navigate(['/inicio/infoEvent', uid]);
    this.router.navigate(['/inicio/reporte2']);
  }

  volverInicio(){
    this.router.navigate(['inicio']);
  }
}
