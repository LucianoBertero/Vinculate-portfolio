import { EventEmitter, Injectable } from '@angular/core';
import { Donations } from '../interfaces/donations';

@Injectable({
  providedIn: 'root'
})
export class ModifyDonationsService {

  private _ocutarModal: boolean = true;
  public addedDonation: EventEmitter<Donations> =
    new EventEmitter<Donations>();

  get ocultarModal() {
    return this._ocutarModal;
  }

  abrirModal() {
    this._ocutarModal = false;
  }

  cerrarModal() {
    this._ocutarModal = true;
  }

  constructor() {}

  openModifyDonations() {
    
  }
}
