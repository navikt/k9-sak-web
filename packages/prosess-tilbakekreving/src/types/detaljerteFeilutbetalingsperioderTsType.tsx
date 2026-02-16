import type { Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';

export type DetaljertFeilutbetalingPeriode = {
  fom: string;
  tom: string;
  årsak: {
    hendelseType: KodeverkMedNavn;
    hendelseUndertype?: KodeverkMedNavn;
  };
  feilutbetaling: number;
  ytelser: {
    aktivitet: string;
    belop: number;
  }[];
  redusertBeloper?: {
    erTrekk: boolean;
    belop: number;
  }[];
  oppfyltValg?: Kodeverk;
  foreldet?: boolean;
};

type DetaljerteFeilutbetalingsperioder = {
  perioder: DetaljertFeilutbetalingPeriode[];
  rettsgebyr: number;
};

export default DetaljerteFeilutbetalingsperioder;
