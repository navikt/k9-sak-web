import type {
  FeilutbetalingFaktaViewModel,
  FeilutbetalingÅrsakerPerYtelseViewModel,
} from './FeilutbetalingFaktaViewModel.js';

export interface FeilutbetalingFaktaApi {
  readonly backend: 'k9tilbake' | 'ungtilbake';
  hentFeilutbetalingFakta(behandlingUuid: string): Promise<FeilutbetalingFaktaViewModel>;
  hentFeilutbetalingÅrsaker(): Promise<FeilutbetalingÅrsakerPerYtelseViewModel[]>;
}
