import type { TilkjentYtelseApi } from '../../prosess/tilkjent-ytelse/api/TilkjentYtelseApi.js';
import type { FeriepengerPrÅr } from '../../prosess/tilkjent-ytelse/components/feriepenger/FeriepengerPanel.js';
import type { ArbeidsgiverOpplysningerPerId } from '../../prosess/tilkjent-ytelse/types/arbeidsgiverOpplysningerType.js';
import { ignoreUnusedDeclared } from './ignoreUnusedDeclared.js';

export class FakeTilkjentYtelseBackendApi implements TilkjentYtelseApi {
  #feriepengerPrÅr: FeriepengerPrÅr;

  constructor(feriepengerPrÅr: FeriepengerPrÅr) {
    this.#feriepengerPrÅr = feriepengerPrÅr;
  }

  async hentFeriepengegrunnlagPrÅr(behandlingUuid: string): Promise<FeriepengerPrÅr> {
    ignoreUnusedDeclared(behandlingUuid);
    return this.#feriepengerPrÅr;
  }
}

export const mockArbeidsgiverOpplysninger: ArbeidsgiverOpplysningerPerId = {
  12345678: {
    navn: 'BEDRIFT1 AS',
    erPrivatPerson: false,
    identifikator: '12345678',
  },
  '910909088': {
    identifikator: '910909088',
    navn: 'EQUINOR ASA AVD STATOIL SOKKELVIRKSOMHET',
    erPrivatPerson: false,
  },
  '973861778': {
    identifikator: '973861778',
    navn: 'SOPRA STERIA AS',
    erPrivatPerson: false,
  },
};
