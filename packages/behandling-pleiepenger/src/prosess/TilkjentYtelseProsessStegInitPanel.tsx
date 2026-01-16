import TilkjentYtelseProsessIndex from '@fpsak-frontend/prosess-tilkjent-ytelse';
import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon,
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  k9_sak_kontrakt_beregningsresultat_BeregningsresultatMedUtbetaltePeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeVurdert } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeVurdert.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { TilkjentYtelseProsessIndex as TilkjentYtelseProsessIndexV2 } from '@k9-sak-web/gui/prosess/tilkjent-ytelse/TilkjentYtelseProsessIndex.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { useSuspenseQueries } from '@tanstack/react-query';
import { use, useContext, useMemo } from 'react';
import { K9SakProsessApi } from './api/K9SakProsessApi';
import {
  aksjonspunkterQueryOptions,
  arbeidsgiverOpplysningerQueryOptions,
  personopplysningerQueryOptions,
} from './api/k9SakQueryOptions';

// Definer panel-identitet som konstanter
const PANEL_ID = prosessStegCodes.TILKJENT_YTELSE;
const PANEL_TEKST = 'Tilkjent ytelse';

/**
 * Sjekker om beregningsresultatet kun inneholder avslåtte uttak
 */
const harKunAvslåtteUttak = (
  beregningsresultatUtbetaling: k9_sak_kontrakt_beregningsresultat_BeregningsresultatMedUtbetaltePeriodeDto,
): boolean => {
  if (!beregningsresultatUtbetaling?.perioder) {
    return false;
  }
  const { perioder } = beregningsresultatUtbetaling;
  const alleUtfall = perioder.flatMap(({ andeler }) => [
    ...andeler.flatMap(({ uttak }) => [...(uttak ?? []).flatMap(({ utfall }) => utfall)]),
  ]);
  return !alleUtfall.some(utfall => utfall === 'INNVILGET');
};

interface Props {
  api: K9SakProsessApi;
  behandling: Behandling;
  fagsak: Fagsak;
  isReadOnly: boolean;
  submitCallback: (data: any, aksjonspunkt: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) => Promise<any>;
}

/**
 * InitPanel for tilkjent ytelse prosesssteg
 *
 * Wrapper for TilkjentYtelseProsessIndex som håndterer:
 * - Registrering med menyen via usePanelRegistrering
 * - Datahenting via RequestApi
 * - Rendering av legacy panelkomponent
 */
export function TilkjentYtelseProsessStegInitPanel(props: Props) {
  const { BRUK_V2_TILKJENT_YTELSE } = use(FeatureTogglesContext);
  const context = useContext(ProsessPanelContext);

  // Hent alle data parallelt med useSuspenseQueries
  const [
    { data: beregningsresultatUtbetaling },
    { data: personopplysninger },
    { data: aksjonspunkter },
    { data: arbeidsgiverOpplysningerPerId },
  ] = useSuspenseQueries({
    queries: [
      {
        queryKey: ['beregningsresultatUtbetaling', props.behandling?.uuid, props.behandling?.versjon],
        queryFn: () => props.api.getBeregningsresultatMedUtbetaling(props.behandling.uuid),
      },
      personopplysningerQueryOptions(props.api, props.behandling),
      aksjonspunkterQueryOptions(props.api, props.behandling, (data: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) =>
        data.filter(
          ap => ap.definisjon === k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon.VURDER_TILBAKETREKK,
        ),
      ),
      arbeidsgiverOpplysningerQueryOptions(props.api, props.behandling),
    ],
  });

  // Beregn paneltype basert på beregningsresultat (for menystatusindikator)
  const panelType = useMemo((): ProcessMenuStepType => {
    // Hvis ingen data eller tomt objekt, vis default (ingen status)
    if (!beregningsresultatUtbetaling?.perioder) {
      return ProcessMenuStepType.default;
    }

    // Hvis kun avslåtte uttak, vis danger (rød)
    if (harKunAvslåtteUttak(beregningsresultatUtbetaling)) {
      return ProcessMenuStepType.danger;
    }

    // Ellers vis success (grønn hake)
    return ProcessMenuStepType.success;
  }, [beregningsresultatUtbetaling]);

  const erValgt = context?.erValgt(PANEL_ID);
  // Registrer panel med menyen
  usePanelRegistrering({ ...context, erValgt }, PANEL_ID, PANEL_TEKST, panelType);

  const erStegVurdert = panelType !== ProcessMenuStepType.default;

  // Render kun hvis panelet er valgt (injisert av ProsessMeny)
  if (!erValgt) {
    return null;
  }
  if (!erStegVurdert) {
    return <ProsessStegIkkeVurdert />;
  }

  const handleSubmit = async (data: any) => {
    return props.submitCallback(data, aksjonspunkter);
  };

  const harApentAksjonspunkt = aksjonspunkter?.some(ap => ap.status === 'OPPR');
  const readOnlySubmitButton = !harApentAksjonspunkt;
  if (BRUK_V2_TILKJENT_YTELSE) {
    return (
      <TilkjentYtelseProsessIndexV2
        behandling={{ uuid: props.behandling.uuid }}
        beregningsresultat={beregningsresultatUtbetaling}
        personopplysninger={personopplysninger}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId.arbeidsgivere}
        aksjonspunkter={aksjonspunkter}
        isReadOnly={props.isReadOnly}
        submitCallback={handleSubmit}
        readOnlySubmitButton={readOnlySubmitButton}
      />
    );
  }
  return (
    <TilkjentYtelseProsessIndex
      fagsak={props.fagsak}
      beregningsresultat={beregningsresultatUtbetaling}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId.arbeidsgivere}
      aksjonspunkter={aksjonspunkter}
      isReadOnly={props.isReadOnly}
      submitCallback={handleSubmit}
      readOnlySubmitButton={readOnlySubmitButton}
    />
  );
}
