import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioServiceService } from 'src/app/services/usuario-service.service';
import Swal from 'sweetalert2';
import { ModalPasswordService } from 'src/app/services/modal-password.service';
import { updateFormVoluntario } from 'src/app/interfaces/updateVoluntarioForm.interface';

@Component({
  selector: 'app-accunt-settings-voluntario',
  templateUrl: './accunt-settings-voluntario.component.html',
  styleUrls: ['./accunt-settings-voluntario.component.css'],
})
export class AccuntSettingsVoluntarioComponent implements OnInit {
  token = this.authService.token;
  uId = this.authService.usuario.uid;
  name = this.authService.usuario.name;
  public updateDataUserForm;
  public formSubmittedUpdateVoluntario = true;
  form: updateFormVoluntario;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioServiceService,
    public modalPasswordService: ModalPasswordService
  ) {}

  ngOnInit(): void {
    this.buildFormUpdateDataUser();
    this.getUsuarioData();
  }

  buildFormUpdateDataUser() {
    this.updateDataUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  //updateAccountSettings() {}

  //actualiza los datos del voluntario
  updateAccountSettings() {
    Swal.fire({
      title: 'Actualizando',
      html: 'Esperando respuesta del servidor',
      timer: 99999,
      timerProgressBar: true,
      showConfirmButton: false,
    });

    this.usuarioService
      .updateDataVoluntario(
        this.updateDataUserForm.value,
        this.uId,
        this.token,
      )
      .subscribe(
        (response) => {
          Swal.fire(
            'Usuario Modificado',
            'Su Organizacion se modifico correctamente',
            'success'
          );
          this.router.navigate(['/inicio']);
        },
        (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
  }

  campoNoValidoOrganizacion(campo: string): boolean {
    if (
      
      this.updateDataUserForm?.get(campo).invalid &&
      this?.formSubmittedUpdateVoluntario
    ) {
      return true;
    } else {
      return false;
    }
  }

  getUsuarioData() {
    return this.usuarioService.obtenerUsuarioId(this.uId, this.token).subscribe(
      (response: any) => {
        this.updateDataUserForm.patchValue({
          name: response.usuario.name,
          email: response.usuario.email,
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  cancelar() {
    this.router.navigate(['/inicio']);
  }


  eliminarCuentaVoluntario() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ml-2',
        cancelButton: 'btn btn-danger ml-2',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `¿Estas seguro de elimninar tu cuenta ${this.name}?`,
        text: 'Tu cuenta y tu datos serán eliminados',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            `¡Eliminada!`,
            `La cuenta "${this.name}" ha sido eliminado con exito`,
            'success'
          );

          this.usuarioService
            .deleteVoluntario(this.uId, this.token)
            .subscribe((res) => {
              this.authService.logout();
            });
            // this.authService.logout()

        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            '¡Cancelado!',
            'Tus datos y tu cuenta están seguros',
            'error'
          );
        }
      });

  }

  



  abrirModal() {
    this.modalPasswordService.abrirModal(this.uId, 'usr', this.token);
  }

}
