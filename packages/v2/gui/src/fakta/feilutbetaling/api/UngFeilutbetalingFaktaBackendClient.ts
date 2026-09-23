import {
  behandlingfakta_hentFeilutbetalingFakta,
  kodeverk_hentAlleFeilutbetalingÅrsaker,
} from '@k9-sak-web/backend/ungtilbake/generated/sdk.js';
import type { BehandlingFeilutbetalingFaktaDto } from '@k9-sak-web/backend/ungtilbake/kontrakt/feilutbetaling/BehandlingFeilutbetalingFaktaDto.js';
import type { HendelseTyperPrYtelseTypeDto } from '@k9-sak-web/backend/ungtilbake/kontrakt/feilutbetaling/HendelseTyperDto.js';
import type { FeilutbetalingFaktaApi } from './FeilutbetalingFaktaApi.js';
import type {
  FeilutbetalingFaktaViewModel,
  FeilutbetalingÅrsakerPerYtelseViewModel,
} from './FeilutbetalingFaktaViewModel.js';

const mapUngFeilutbetalingFakta = (faktaDto: BehandlingFeilutbetalingFaktaDto): FeilutbetalingFaktaViewModel => {
  const fakta = faktaDto.behandlingFakta;

  return {
    behandlingFakta: {
      aktuellFeilUtbetaltBeløp: fakta.aktuellFeilUtbetaltBeløp,
      ...(fakta.begrunnelse !== undefined && { begrunnelse: fakta.begrunnelse }),
      datoForRevurderingsvedtak: fakta.datoForRevurderingsvedtak,
      perioder: fakta.perioder.map(periode => ({
        belop: periode.belop,
        ...(periode.feilutbetalingÅrsakDto !== undefined && {
          feilutbetalingÅrsakDto: {
            hendelseType: periode.feilutbetalingÅrsakDto.hendelseType,
            hendelseUndertype: periode.feilutbetalingÅrsakDto.hendelseUndertype,
          },
        }),
        fom: periode.fom,
        tom: periode.tom,
      })),
      ...(fakta.tidligereVarseltBeløp !== undefined && { tidligereVarseltBeløp: fakta.tidligereVarseltBeløp }),
      ...(fakta.tilbakekrevingValg !== undefined && {
        tilbakekrevingValg: {
          ...(fakta.tilbakekrevingValg.videreBehandling !== undefined && {
            videreBehandling: fakta.tilbakekrevingValg.videreBehandling,
          }),
        },
      }),
      totalPeriodeFom: fakta.totalPeriodeFom,
      totalPeriodeTom: fakta.totalPeriodeTom,
    },
  };
};

const mapUngFeilutbetalingÅrsaker = (
  årsaker: HendelseTyperPrYtelseTypeDto[],
): FeilutbetalingÅrsakerPerYtelseViewModel[] =>
  årsaker.map(ytelse => ({
    hendelseTyper: ytelse.hendelseTyper.map(hendelse => ({
      hendelseType: hendelse.hendelseType,
      hendelseUndertyper: hendelse.hendelseUndertyper,
    })),
    ytelseType: ytelse.ytelseType,
  }));

export class UngFeilutbetalingFaktaBackendClient implements FeilutbetalingFaktaApi {
  readonly backend = 'ungtilbake' as const;

  async hentFeilutbetalingFakta(behandlingUuid: string): Promise<FeilutbetalingFaktaViewModel> {
    const response = await behandlingfakta_hentFeilutbetalingFakta({
      query: { behandlingUuid },
    });
    return mapUngFeilutbetalingFakta(response.data);
  }

  async hentFeilutbetalingÅrsaker(): Promise<FeilutbetalingÅrsakerPerYtelseViewModel[]> {
    const response = await kodeverk_hentAlleFeilutbetalingÅrsaker();
    return mapUngFeilutbetalingÅrsaker(response.data);
  }
}
