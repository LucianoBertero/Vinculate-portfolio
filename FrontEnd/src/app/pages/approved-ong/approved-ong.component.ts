import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { OrganizacionService } from 'src/app/services/organizacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-approved-ong',
  templateUrl: './approved-ong.component.html',
  styleUrls: ['./approved-ong.component.css']
})
export class ApprovedONGComponent implements OnInit{

  pendingONG:any = []
  token:string

  constructor(private organizacionService: OrganizacionService, private authService:AuthService){}

  ngOnInit(): void {
    this.token = this.authService.token
    console.log(this.token)
    this.approvedONGArray()

  }

  approvedONGArray(){

    this.organizacionService.getPendingONG().subscribe((data:any) => {
      this.pendingONG = data.organizaciones
      console.log("ONGSSS: ",this.pendingONG)

    })
  }

  approveONG(uid:string) {
    this.organizacionService.putApproved(uid, this.token).subscribe((data) => {
      Swal.fire(
        'Organizacion aprobada',
        'La Organizacion se aprobo correctamente',
        'success'
      );
      setTimeout(function() {
        location.reload();
      }, 3000);
    },
    (err) => {
      Swal.fire('Error', err.error.msg, 'error');
    }
  );
    
  }

  refuseONG(uid:string) {
    this.organizacionService.putRefused(uid, this.token).subscribe((data) => {
      Swal.fire(
        'Organizacion Rechazada',
        'La Organizacion se rechazo correctamente',
        'success'
      );
      setTimeout(function() {
        location.reload();
      }, 3000);
    },
    (err) => {
      Swal.fire('Error', err.error.msg, 'error');
    }
  );
    
  }

}
