import { Component } from '@angular/core';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { ModalPasswordService } from 'src/app/services/modal-password.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
@Component({
  selector: 'app-modal-password',
  templateUrl: './modal-password.component.html',
  styleUrls: ['./modal-password.component.css'],
})
export class ModalPasswordComponent {
  public updateDataPassword;
  public formSubmittedModal;
  public uId;
  public tipoUsr;

  constructor(
    public modalPasswordService: ModalPasswordService,
    private fb: FormBuilder,
    private utilitiesService: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.buildFormUpdateDataONG();
  }

  buildFormUpdateDataONG() {
    this.updateDataPassword = this.fb.group(
      {
        oldPassword: ['', [Validators.required, Validators.minLength(5)]],

        newPassword: ['', [Validators.required, Validators.minLength(5)]],
        repitPassword: ['', [Validators.required, Validators.minLength(5)]],
      },
      {
        validators: this.passwordsIguales('newPassword', 'repitPassword'),
      }
    );
  }

  passwordsIguales(pass1Name: string, pass2Name: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ noEsIgual: true });
        pass1Control.setErrors({ noEsIgual: true });
      }
    };
  }

  cerrarModal() {
    this.modalPasswordService.cerrarModal();
    this.formSubmittedModal = false;
    this.buildFormUpdateDataONG();
  }

  campoNoValidoPassword(campo: string): boolean {
    if (
      this.updateDataPassword?.get(campo).invalid &&
      this?.formSubmittedModal
    ) {
      return true;
    } else {
      return false;
    }
  }

  changePassword() {
    this.formSubmittedModal = true;
    console.log(this.modalPasswordService.getTipoUsr);
    console.log(this.modalPasswordService.getUid);
    console.log(this.modalPasswordService.getToken);
    let oldPassword = this.updateDataPassword.get('oldPassword').value;
    let newPassword = this.updateDataPassword.get('newPassword').value;
    let id = this.modalPasswordService.getUid;
    let token = this.modalPasswordService.getToken;

    this.utilitiesService
      .changePassword(oldPassword, newPassword, id, token)
      .subscribe(
        // this.usuarioService.login(this.loginForm.value).subscribe(
        (resp) => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: 'success',
            title: 'Contraseña cambiada',
          }); // Navegar al Dashboard
          this.cerrarModal();
        },
        (err) => {
          // Si sucede un error
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
   
  }
}
