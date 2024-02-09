import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reporte2',
  templateUrl: './reporte2.component.html',
  styleUrls: ['./reporte2.component.css']
})
export class Reporte2Component {


  constructor(
    private router: Router,
    // private eventService: EventService,
    // private orgService: OrganizacionService,
    // private authService: AuthService
  ) {}
  
  ngOnInit(): void {}

  volverAtras(){
    this.router.navigate(['inicio/reportes']);
  }
}
