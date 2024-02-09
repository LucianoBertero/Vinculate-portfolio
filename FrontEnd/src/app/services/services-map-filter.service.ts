import { EventEmitter, Injectable } from '@angular/core';
import { FiltrosAplicados } from '../interfaces/filtros-modal';

@Injectable({
  providedIn: 'root',
})
export class ServicesMapFilterService {
  private _ocutarModal: boolean = true;
  public filtrosAplicados: EventEmitter<FiltrosAplicados> =
    new EventEmitter<FiltrosAplicados>();

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

  aplicarFiltros() {}
}
