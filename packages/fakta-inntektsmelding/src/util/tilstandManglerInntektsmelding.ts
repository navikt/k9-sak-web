import { Tilstand as TilstandResponse } from '../types/KompletthetResponse';
import { Tilstand } from '../types/KompletthetData';

export default (tilstand: Tilstand | TilstandResponse): boolean =>
  tilstand.status.some(({ status }) => status === 'MANGLER');
