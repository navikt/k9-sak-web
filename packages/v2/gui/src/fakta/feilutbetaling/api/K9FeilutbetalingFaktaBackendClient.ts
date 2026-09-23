import {
  behandlingfakta_hentFeilutbetalingFakta,
  kodeverk_hentAlleFeilutbetalingÅrsaker,
} from '@k9-sak-web/backend/k9tilbake/generated/sdk.js';
import type { BehandlingFeilutbetalingFaktaDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/BehandlingFeilutbetalingFaktaDto.js';
import type { HendelseTyperPrYtelseTypeDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/HendelseTyperDto.js';
import type { FeilutbetalingFaktaApi } from './FeilutbetalingFaktaApi.js';
import type {
  FeilutbetalingFaktaViewModel,
  FeilutbetalingÅrsakerPerYtelseViewModel,
} from './FeilutbetalingFaktaViewModel.js';

const mapK9FeilutbetalingFakta = (faktaDto: BehandlingFeilutbetalingFaktaDto): FeilutbetalingFaktaViewModel => {
  const fakta = faktaDto.behandlingFakta;
  if (!fakta) return {};

  return {
    behandlingFakta: {
      ...(fakta.aktuellFeilUtbetaltBeløp !== undefined && {
        aktuellFeilUtbetaltBeløp: fakta.aktuellFeilUtbetaltBeløp,
      }),
      ...(fakta.begrunnelse !== undefined && { begrunnelse: fakta.begrunnelse }),
      ...(fakta.datoForRevurderingsvedtak !== undefined && {
        datoForRevurderingsvedtak: fakta.datoForRevurderingsvedtak,
      }),
      ...(fakta.perioder !== undefined && {
        perioder: fakta.perioder.map(periode => ({
          ...(periode.belop !== undefined && { belop: periode.belop }),
          ...(periode.feilutbetalingÅrsakDto !== undefined && {
            feilutbetalingÅrsakDto: {
              hendelseType: periode.feilutbetalingÅrsakDto.hendelseType,
              hendelseUndertype: periode.feilutbetalingÅrsakDto.hendelseUndertype,
            },
          }),
          ...(periode.fom !== undefined && { fom: periode.fom }),
          ...(periode.tom !== undefined && { tom: periode.tom }),
        })),
      }),
      ...(fakta.tidligereVarseltBeløp !== undefined && { tidligereVarseltBeløp: fakta.tidligereVarseltBeløp }),
      ...(fakta.tilbakekrevingValg !== undefined && {
        tilbakekrevingValg: {
          ...(fakta.tilbakekrevingValg.videreBehandling !== undefined && {
            videreBehandling: fakta.tilbakekrevingValg.videreBehandling,
          }),
        },
      }),
      ...(fakta.totalPeriodeFom !== undefined && { totalPeriodeFom: fakta.totalPeriodeFom }),
      ...(fakta.totalPeriodeTom !== undefined && { totalPeriodeTom: fakta.totalPeriodeTom }),
    },
  };
};

const mapK9FeilutbetalingÅrsaker = (
  årsaker: HendelseTyperPrYtelseTypeDto[],
): FeilutbetalingÅrsakerPerYtelseViewModel[] =>
  årsaker.map(ytelse => ({
    ...(ytelse.hendelseTyper !== undefined && {
      hendelseTyper: ytelse.hendelseTyper.map(hendelse => ({
        ...(hendelse.hendelseType !== undefined && { hendelseType: hendelse.hendelseType }),
        ...(hendelse.hendelseUndertyper !== undefined && { hendelseUndertyper: hendelse.hendelseUndertyper }),
      })),
    }),
    ...(ytelse.ytelseType !== undefined && { ytelseType: ytelse.ytelseType }),
  }));

export class K9FeilutbetalingFaktaBackendClient implements FeilutbetalingFaktaApi {
  readonly backend = 'k9tilbake' as const;

  async hentFeilutbetalingFakta(behandlingUuid: string): Promise<FeilutbetalingFaktaViewModel> {
    const response = await behandlingfakta_hentFeilutbetalingFakta({
      query: { uuid: { behandlingId: behandlingUuid } },
    });
    return mapK9FeilutbetalingFakta(response.data);
  }

  async hentFeilutbetalingÅrsaker(): Promise<FeilutbetalingÅrsakerPerYtelseViewModel[]> {
    const response = await kodeverk_hentAlleFeilutbetalingÅrsaker();
    return mapK9FeilutbetalingÅrsaker(response.data);
  }
}
