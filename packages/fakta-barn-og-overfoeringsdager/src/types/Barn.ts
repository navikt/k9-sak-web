import stringEnum from '@k9-sak-web/types/src/tsUtils';

export interface Barn {
  erKroniskSykt?: boolean;
  aleneomsorg?: boolean;
}

export const BarnEnum = stringEnum({
  HENTET_AUTOMATISK: 'HENTET_AUTOMATISK',
  MANUELT_LAGT_TIL: 'MANUELT_LAGT_TIL',
});
export type Barntype = typeof BarnEnum[keyof typeof BarnEnum];

export interface BarnHentetAutomatisk extends Barn {
  fødselsnummer: string;
}

export interface BarnLagtTilAvSakbehandler extends Barn {
  id: string;
  fødselsdato: string;
}
