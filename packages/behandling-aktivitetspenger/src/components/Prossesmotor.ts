import { isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import {
  ung_kodeverk_vilkår_Utfall,
  ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  ung_sak_kontrakt_vilkår_VilkårMedPerioderDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { isAksjonspunktOpen } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { UngSakApi } from '../data/UngSakApi';
import { aksjonspunkterQueryOptions, vilkårQueryOptions } from '../data/ungSakQueryOptions';

const PROSESS_STEG_KODER = {
  VEDTAK: 'vedtak',
  BEREGNING: 'beregning',
} as const;

const PANEL_KONFIG = {
  vedtak: {
    aksjonspunkter: [
      AksjonspunktDefinisjon.FORESLÅ_VEDTAK,
      AksjonspunktDefinisjon.FATTER_VEDTAK,
      AksjonspunktDefinisjon.FORESLÅ_VEDTAK_MANUELT,
      AksjonspunktDefinisjon.VEDTAK_UTEN_TOTRINNSKONTROLL,
      AksjonspunktDefinisjon.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST,
      AksjonspunktDefinisjon.KONTROLL_AV_MANUELT_OPPRETTET_REVURDERINGSBEHANDLING,
      AksjonspunktDefinisjon.SJEKK_TILBAKEKREVING,
    ],
    id: PROSESS_STEG_KODER.VEDTAK,
    label: 'Vedtak',
  },
  beregning: {
    aksjonspunkter: [],
    id: PROSESS_STEG_KODER.BEREGNING,
    label: 'Beregning',
  },
} as const;

const beregnVedtakType = (
  vilkår: ung_sak_kontrakt_vilkår_VilkårMedPerioderDto[],
  aksjonspunkter: ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto[],
  behandling: Pick<BehandlingDto, 'uuid' | 'versjon' | 'behandlingsresultat'>,
  vedtakAksjonspunkter: readonly string[],
): ProcessMenuStepType => {
  if (!vilkår || vilkår.length === 0) {
    return ProcessMenuStepType.default;
  }

  const harIkkeVurdertVilkar = vilkår.some(v =>
    v.perioder?.some(periode => periode.vilkarStatus === ung_kodeverk_vilkår_Utfall.IKKE_VURDERT),
  );

  const harÅpneAksjonspunkter = aksjonspunkter?.some(
    ap => vedtakAksjonspunkter.some(vap => vap === ap.definisjon) && ap.status && isAksjonspunktOpen(ap.status),
  );

  if (harIkkeVurdertVilkar) {
    return ProcessMenuStepType.default;
  }
  if (harÅpneAksjonspunkter) {
    return ProcessMenuStepType.warning;
  }
  if (behandling?.behandlingsresultat?.type) {
    return isAvslag(behandling.behandlingsresultat.type) ? ProcessMenuStepType.danger : ProcessMenuStepType.success;
  }
  return ProcessMenuStepType.default;
};

interface ProsessmotorProps {
  api: UngSakApi;
  behandling: Pick<BehandlingDto, 'uuid' | 'versjon'>;
}

export const useProsessmotor = ({ api, behandling }: ProsessmotorProps) => {
  const { data: vilkår } = useSuspenseQuery(vilkårQueryOptions(api, behandling));
  const { data: aksjonspunkter } = useSuspenseQuery(aksjonspunkterQueryOptions(api, behandling));
  return useMemo(() => {
    const beregningPanel = {
      id: PANEL_KONFIG.beregning.id,
      label: PANEL_KONFIG.beregning.label,
      type: ProcessMenuStepType.default,
      usePartialStatus: false,
      urlKode: prosessStegCodes.BEREGNING,
    };
    const vedtakType = beregnVedtakType(vilkår, aksjonspunkter, behandling, PANEL_KONFIG.vedtak.aksjonspunkter);
    const vedtakPanel = {
      id: PANEL_KONFIG.vedtak.id,
      label: PANEL_KONFIG.vedtak.label,
      type: vedtakType,
      usePartialStatus: false,
      urlKode: prosessStegCodes.VEDTAK,
    };

    return [beregningPanel, vedtakPanel];
  }, [vilkår, aksjonspunkter, behandling]);
};
