import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalPasswordService {
  private _ocutarModal: boolean = true;
  private tipo;
  private uid;
  public token;

  get ocultarModal() {
    return this._ocutarModal;
  }

  get getUid() {
    console.log('entro a get uid');
    console.log(this.uid);
    return this.uid;
  }
  get getTipoUsr() {
    return this.tipo;
  }

  get getToken() {
    return this.token;
  }

  abrirModal(uid: string, tipoUsr: 'usr' | 'ong', token: string) {
    this.tipo = tipoUsr;
    this.uid = uid;
    this.token = token;
    console.log(this.uid);
    this._ocutarModal = false;
  }

  cerrarModal() {
    this._ocutarModal = true;
  }

  constructor() {}
}
