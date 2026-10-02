import type {
  FeilutbetalingFaktaViewModel,
  FeilutbetalingÅrsakerPerYtelseViewModel,
} from './FeilutbetalingFaktaViewModel.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface FeilutbetalingFaktaApi extends BackendTilhørighet<'k9tilbake' | 'ungtilbake'> {
  hentFeilutbetalingFakta(behandlingUuid: string): Promise<FeilutbetalingFaktaViewModel>;
  hentFeilutbetalingÅrsaker(): Promise<FeilutbetalingÅrsakerPerYtelseViewModel[]>;
}
