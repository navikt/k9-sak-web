import { isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { VilkårMedPerioderDto } from '@k9-sak-web/backend/combined/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { InnloggetAnsattUngV2Dto } from '@k9-sak-web/backend/ungsak/kontrakt/nav-ansatt/InnloggetAnsattUngV2Dto.js';
import { finnPanelStatus, sjekkDelvisVilkårStatus } from '@k9-sak-web/gui/behandling/prosess/utils/vilkårUtils.js';
import { AktivitetspengerApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/AktivitetspengerApi.js';
import {
  aksjonspunkterQueryOptions,
  innloggetBrukerQueryOptions,
  vilkårQueryOptions,
} from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { isAksjonspunktOpen } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import { prosessStegCodes } from '@k9-sak-web/gui/utils/skjermlenke/prosessStegCodes.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const PROSESS_STEG_KODER = {
  INNGANGSVILKAR: prosessStegCodes.INNGANGSVILKAR,
  MEDLEMSKAP: prosessStegCodes.FORUTGAENDE_MEDLEMSKAP,
  VEDTAK: prosessStegCodes.VEDTAK,
  BEREGNING: prosessStegCodes.BEREGNING,
  SATS: prosessStegCodes.SATS,
} as const;

const PANEL_KONFIG = {
  inngangsvilkår: {
    aksjonspunkter: [
      AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR,
      AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR,
      AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR,
      AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
      AksjonspunktDefinisjon.VURDER_BOSTED,
      AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
    ],
    id: PROSESS_STEG_KODER.INNGANGSVILKAR,
    label: 'Inngangsvilkår',
    vilkår: [
      vilkarType.SØKNADSFRIST,
      vilkarType.BISTANDSVILKÅR,
      vilkarType.BOSTEDSVILKÅR,
      vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      vilkarType.ALDERSVILKÅR,
    ],
  },
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
  medlemskap: {
    aksjonspunkter: [AksjonspunktDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAP],
    id: PROSESS_STEG_KODER.MEDLEMSKAP,
    label: 'Medlemskap',
    vilkår: [vilkarType.FORUTGÅENDE_MEDLEMSKAPSVILKÅRET],
  },
  sats: {
    aksjonspunkter: [],
    id: PROSESS_STEG_KODER.SATS,
    label: 'Sats',
  },
} as const;

const erPanelVurdert = (panelType: ProcessMenuStepType): boolean => {
  return panelType === ProcessMenuStepType.success || panelType === ProcessMenuStepType.danger;
};

interface ProcessMenuStep {
  id: string;
  label: string;
  type: ProcessMenuStepType;
  usePartialStatus?: boolean;
  erVurdert?: boolean;
  locked?: boolean;
  urlKode?: string;
}

/**
 * Bygger et vilkårbasert panel for prosessmenyen.
 *
 * @param skalVisePanel - Om forrige panel er ferdig vurdert
 * @param vilkår - Alle vilkår for behandlingen
 * @param panelKonfig - Konfigurasjon med relevante vilkår og aksjonspunkter
 * @param aksjonspunkter - Alle aksjonspunkter for behandlingen
 * @param label - Paneltittel
 * @param id - Unik ID for panelet
 * @returns Panelobjekt med status og metadata
 */
const byggVilkårPanel = (
  skalVisePanel: boolean | undefined,
  vilkår: VilkårMedPerioderDto[],
  panelKonfig: { vilkår: readonly string[]; aksjonspunkter: readonly string[]; label: string; id: string },
  aksjonspunkter: AksjonspunktDto[],
): ProcessMenuStep => {
  const relevanteVilkår = vilkår.filter(v => panelKonfig.vilkår.includes(v.vilkarType));
  const type = finnPanelStatus(!!skalVisePanel, relevanteVilkår, aksjonspunkter, panelKonfig.aksjonspunkter);

  return {
    type,
    label: panelKonfig.label,
    id: panelKonfig.id,
    usePartialStatus: sjekkDelvisVilkårStatus(relevanteVilkår),
    erVurdert: erPanelVurdert(type),
    urlKode: panelKonfig.id,
  };
};

const byggPanelUtenVilkår = (
  forrigeVurdert: boolean | undefined,
  type: ProcessMenuStepType,
  panelKonfig: { aksjonspunkter: readonly string[]; label: string; id: string },
): ProcessMenuStep => ({
  type: forrigeVurdert ? type : ProcessMenuStepType.default,
  label: panelKonfig.label,
  id: panelKonfig.id,
  erVurdert: erPanelVurdert(forrigeVurdert ? type : ProcessMenuStepType.default),
  urlKode: panelKonfig.id,
});

const beregnVedtakType = (
  vilkår: VilkårMedPerioderDto[],
  aksjonspunkter: AksjonspunktDto[],
  behandling: Pick<BehandlingDto, 'uuid' | 'versjon' | 'behandlingsresultat'>,
  vedtakAksjonspunkter: readonly string[],
): ProcessMenuStepType => {
  if (!vilkår || vilkår.length === 0) {
    return ProcessMenuStepType.default;
  }

  const harIkkeVurdertVilkar = vilkår.some(v =>
    v.perioder?.some(periode => periode.vilkarStatus === Utfall.IKKE_VURDERT),
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

const beregnInngangsvilkårType = (aksjonspunkter: AksjonspunktDto[], vilkår: VilkårMedPerioderDto[]) => {
  const harÅpneAksjonspunkter = aksjonspunkter?.some(
    ap =>
      PANEL_KONFIG.inngangsvilkår.aksjonspunkter.some(vap => vap === ap.definisjon) &&
      ap.status &&
      isAksjonspunktOpen(ap.status),
  );
  if (harÅpneAksjonspunkter) {
    return ProcessMenuStepType.warning;
  }
  const relevanteVilkår = vilkår.filter(v =>
    PANEL_KONFIG.inngangsvilkår.vilkår.some(vilkårType => vilkårType === v.vilkarType),
  );

  // Dersom et vilkår bare har en periode og denne er avslått, skal panelet vises som avslag.
  const harAvslag = relevanteVilkår.some(
    v => v.perioder?.length === 1 && v.perioder?.some(periode => periode.vilkarStatus === Utfall.IKKE_OPPFYLT),
  );
  if (harAvslag) {
    return ProcessMenuStepType.danger;
  }
  return ProcessMenuStepType.success;
};

const byggInngangsvilkårPanel = (
  aksjonspunkter: AksjonspunktDto[],
  vilkår: VilkårMedPerioderDto[],
  innloggetBruker: InnloggetAnsattUngV2Dto,
): ProcessMenuStep => {
  const type = beregnInngangsvilkårType(aksjonspunkter, vilkår);
  const isLocked =
    type === ProcessMenuStepType.success &&
    !innloggetBruker?.aktivitetspengerDel1SaksbehandlerTilgang?.kanBeslutte &&
    !innloggetBruker?.aktivitetspengerDel1SaksbehandlerTilgang?.kanSaksbehandle;

  return {
    ...byggPanelUtenVilkår(true, type, PANEL_KONFIG.inngangsvilkår),
    locked: isLocked,
  };
};

interface ProsessmotorProps {
  api: AktivitetspengerApi;
  behandling: Pick<BehandlingDto, 'uuid' | 'versjon'>;
}

export const useProsessmotor = ({ api, behandling }: ProsessmotorProps) => {
  const { data: vilkår } = useSuspenseQuery(vilkårQueryOptions(api, behandling));
  const { data: aksjonspunkter } = useSuspenseQuery(aksjonspunkterQueryOptions(api, behandling));
  const { data: innloggetBruker } = useSuspenseQuery(innloggetBrukerQueryOptions(api));

  return useMemo(() => {
    const inngangsvilkårPanel = byggInngangsvilkårPanel(aksjonspunkter, vilkår, innloggetBruker);
    const medlemskapPanel = byggVilkårPanel(
      inngangsvilkårPanel.erVurdert && inngangsvilkårPanel.type === ProcessMenuStepType.success,
      vilkår,
      PANEL_KONFIG.medlemskap,
      aksjonspunkter,
    );

    const beregningPanel = {
      id: PANEL_KONFIG.beregning.id,
      label: PANEL_KONFIG.beregning.label,
      type: medlemskapPanel.erVurdert
        ? medlemskapPanel.type === ProcessMenuStepType.success
          ? ProcessMenuStepType.success
          : ProcessMenuStepType.default
        : ProcessMenuStepType.default,
      usePartialStatus: false,
      urlKode: prosessStegCodes.BEREGNING,
    };
    const satsPanel = {
      id: PANEL_KONFIG.sats.id,
      label: PANEL_KONFIG.sats.label,
      type:
        beregningPanel.type === ProcessMenuStepType.success ? ProcessMenuStepType.success : ProcessMenuStepType.default,
      urlKode: prosessStegCodes.SATS,
    };
    const vedtakType = beregnVedtakType(vilkår, aksjonspunkter, behandling, PANEL_KONFIG.vedtak.aksjonspunkter);
    const vedtakPanel = {
      id: PANEL_KONFIG.vedtak.id,
      label: PANEL_KONFIG.vedtak.label,
      type: vedtakType,
      usePartialStatus: false,
      urlKode: prosessStegCodes.VEDTAK,
    };
    return [inngangsvilkårPanel, medlemskapPanel, beregningPanel, satsPanel, vedtakPanel];
  }, [aksjonspunkter, innloggetBruker, vilkår, behandling]);
};
