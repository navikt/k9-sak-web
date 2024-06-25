import KodeverkMedNavn from '@k9-sak-web/types/src/kodeverkMedNavnTsType';

export type AktsomhetInfo = {
  sarligGrunner: KodeverkMedNavn[];
  harGrunnerTilReduksjon: boolean;
  andelTilbakekreves: number;
  ileggRenter: boolean;
  tilbakekrevesBelop: number;
  tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: boolean;
  annetBegrunnelse: string;
  sarligGrunnerBegrunnelse: string;
};

export type VilkarResultatInfo = {
  begrunnelse: string;
  aktsomhet?: string;
  aktsomhetInfo?: AktsomhetInfo;
  erBelopetIBehold?: boolean;
  tilbakekrevesBelop?: number;
};

export type VilkarsVurdertPeriode = {
  fom: string;
  tom: string;
  vilkarResultat: string;
  begrunnelse: string;
  vilkarResultatInfo: VilkarResultatInfo;
  feilutbetalingBelop?: number;
};

type VilkarsVurdertePerioderWrapper = {
  vilkarsVurdertePerioder: VilkarsVurdertPeriode[];
};

export default VilkarsVurdertePerioderWrapper;
