export interface Barn {
  erKroniskSykt?: boolean;
  aleneomsorg?: boolean;
}

export interface BarnHentetAutomatisk extends Barn {
  fødselsnummer: string;
}

export interface BarnLagtTilAvSakbehandler extends Barn {
  id: string;
  fødselsdato: string;
}
