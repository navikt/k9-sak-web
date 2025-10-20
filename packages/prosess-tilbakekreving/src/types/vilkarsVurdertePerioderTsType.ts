import { Kodeverk } from '@k9-sak-web/types';

export type AktsomhetInfo = {
  sarligGrunner: Kodeverk[];
  harGrunnerTilReduksjon: boolean;
  andelTilbakekreves: number;
  ileggRenter: boolean;
  tilbakekrevesBelop: number;
  tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: boolean;
  annetBegrunnelse: string;
  sarligGrunnerBegrunnelse: string;
}

type VilkarResultatInfo = {
  begrunnelse: string;
  aktsomhet?: Kodeverk;
  aktsomhetInfo?: AktsomhetInfo;
  erBelopetIBehold?: boolean;
  tilbakekrevesBelop?: number;
}

export type VilkarsVurdertPeriode = {
  fom: string;
  tom: string;
  vilkarResultat: Kodeverk;
  begrunnelse: string;
  vilkarResultatInfo: VilkarResultatInfo;
  feilutbetalingBelop?: number;
};

type VilkarsVurdertePerioderWrapper = {
  vilkarsVurdertePerioder: VilkarsVurdertPeriode[];
};

export default VilkarsVurdertePerioderWrapper;
