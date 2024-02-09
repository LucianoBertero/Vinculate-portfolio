export interface FiltrosAplicados {
  tipoFiltro: 'ong' | 'evento' | 'ambos' | 'ninguno'; // Puede ser 'ong', 'evento' o 'ambos'
  filtrosOng: string[]; // Array de filtros de ONG
  filtrosEvento: string[]; // Array de filtros de Evento
}
