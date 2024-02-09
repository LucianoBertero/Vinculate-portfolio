import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizacionService } from 'src/app/services/organizacion.service';
import { RegisterComponent } from 'src/app/auth/register/register.component';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { updateFormOrganization } from 'src/app/interfaces/updateOrganizationForm.interface';
import Swal from 'sweetalert2';
import { ModalPasswordService } from 'src/app/services/modal-password.service';

@Component({
  selector: 'app-acount-setting-ong',
  templateUrl: './acount-setting-ong.component.html',
  styleUrls: ['./acount-setting-ong.component.css'],
})
export class AcountSettingONGComponent implements OnInit {
  public updateDataONGForm;
  public formSubmittedUpdateONG = true;
  tiposDeOng = [];
  public imagenSubir: File;
  token = this.authService.token;
  uId = this.authService.usuario.uid;
  name = this.authService.usuario.name;
  ongLink: string;
  form: updateFormOrganization;
  image: File;
  imageUPD: File;

  constructor(
    private fb: FormBuilder,
    private organizacionService: OrganizacionService,
    private authService: AuthService,
    private router: Router,
    public modalPasswordService: ModalPasswordService
  ) {}

  ngOnInit(): void {
    const token = this.authService.token;
    const uId = this.authService.usuario.uid;
    console.log('ID: ', uId);
    this.buildFormUpdateDataONG();
    this.tiposDeOng = this.organizacionService.obtenerTipoDeEntidades();
    this.getOrganizationData();
  }

  buildFormUpdateDataONG() {
    this.updateDataONGForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['******', [Validators.required, Validators.minLength(3)]],
        password2: ['******', [Validators.required, Validators.minLength(3)]],
        description: ['', Validators.required],
        typeEntity: ['', Validators.required],
        phone: ['', [Validators.required, Validators.minLength(6)]],
        personInCharge: ['', Validators.required],
        cuit: [
          '',
          [
            Validators.required,
            Validators.minLength(12),
            Validators.maxLength(12),
          ],
        ],
        image: [''],
      },
      {
        validators: this.passwordsIguales('password', 'password2'),
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

  campoNoValidoOrganizacion(campo: string): boolean {
    if (
      this.updateDataONGForm?.get(campo).invalid &&
      this?.formSubmittedUpdateONG
    ) {
      return true;
    } else {
      return false;
    }
  }

  tipoDeOrganizacionNoValida() {
    if (
      this.updateDataONGForm?.get('typeEntity').invalid &&
      this?.formSubmittedUpdateONG
    ) {
      return true;
    } else {
      return false;
    }
  }

  //actualiza los datos de la organizacion
  updateAccountSettings() {
    Swal.fire({
      title: 'Actualizando',
      html: 'Esperando respuesta del servidor',
      timer: 99999,
      timerProgressBar: true,
      showConfirmButton: false,
    });

    this.organizacionService
      .updateDataOrganization(
        this.updateDataONGForm.value,
        this.uId,
        this.token,
        this.imageUPD
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

  cambiarImagen(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const maxSize = 200 * 1024; // Tamaño máximo en bytes (50 KB)

      // Verificar el tamaño del archivo
      if (file.size > maxSize) {
        // Mostrar un mensaje de error o realizar alguna acción adecuada
        Swal.fire('Error', 'El tamaño excede el limite', 'error');
        this.imageUPD = undefined;
        return;
      }

      // Verificar el tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        // Mostrar un mensaje de error o realizar alguna acción adecuada
        Swal.fire('Error', 'formato de archivo no valido', 'error');
        this.imageUPD = undefined;
        return;
      }
      this.imageUPD = file;
      this.mostrarVistaPrevia();

      console.log('imagen big: ', file);
    }
  }

  mostrarVistaPrevia() {
    if (this.imageUPD) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.image = e.target.result;
      };
      reader.readAsDataURL(this.imageUPD);
    }
  }

  imagenNoSeleccionada() {
    if (
      this.updateDataONGForm.image === undefined &&
      this?.formSubmittedUpdateONG
    ) {
      return true;
    } else {
      return false;
    }
  }

  //Obtiene los datos de la organizacion
  getOrganizationData() {
    return this.organizacionService
      .getOrganizationById(this.uId, this.token)
      .subscribe(
        (response: any) => {
          this.updateDataONGForm.patchValue({
            name: response.organizacion.name,
            email: response.organizacion.email,
            personInCharge: response.organizacion.personInCharge,
            typeEntity: response.organizacion.typeEntity,
            phone: response.organizacion.phone,
            cuit: response.organizacion.cuit,
            description: response.organizacion.description,
          });
          this.image = response.organizacion.img;
          console.log(response);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  cancelar() {
    this.router.navigate(['/inicio']);
  }

  eliminarCuenta() {
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

          this.organizacionService
            .deleteOng(this.uId, this.token)
            .subscribe((res) => {
              this.authService.logout();
            });
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

  // getImg(){
  //   let ongLink = '';
  //   this.organizacionService.getOrganizationById(this.name, this.token).subscribe(
  //     (response) => {
  //       const data = response;
  //       const organizacion = data['organizaciones']
  //       if (organizacion.length >= 1) {
  //          ongLink = organizacion[0].img;
  //          this.image = ongLink
  //       }
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );

  //   return ongLink
  // }
}
