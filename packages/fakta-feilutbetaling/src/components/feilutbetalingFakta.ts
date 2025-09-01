import { KodeverkObject } from '@k9-sak-web/lib/kodeverk/types.js';
import { Kodeverk } from '@k9-sak-web/types';

export interface BehandlingFaktaPeriode {
  fom: string;
  tom: string;
  belop: number;
  feilutbetalingÅrsakDto: {
    hendelseType: KodeverkObject;
    hendelseUndertype: KodeverkObject;
  };
}

export interface FeilutbetalingFakta {
  behandlingFakta: {
    aktuellFeilUtbetaltBeløp: number;
    begrunnelse?: string;
    behandlingsresultat: { type: Kodeverk; konsekvenserForYtelsen: Kodeverk[] };
    behandlingÅrsaker: { behandlingArsakType: Kodeverk }[];
    datoForRevurderingsvedtak: string;
    perioder: BehandlingFaktaPeriode[];
    tidligereVarseltBeløp?: number;
    tilbakekrevingValg: { videreBehandling: KodeverkObject };
    totalPeriodeFom: string;
    totalPeriodeTom: string;
  };
}
