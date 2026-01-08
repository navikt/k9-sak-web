import TilkjentYtelseProsessIndex from '@fpsak-frontend/prosess-tilkjent-ytelse';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeVurdert } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeVurdert.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { TilkjentYtelseProsessIndex as TilkjentYtelseProsessIndexV2 } from '@k9-sak-web/gui/prosess/tilkjent-ytelse/TilkjentYtelseProsessIndex.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon } from '@navikt/k9-sak-typescript-client/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { use, useContext, useMemo } from 'react';
import { K9SakProsessApi } from './api/K9SakProsessApi';

/**
 * Sjekker om beregningsresultatet kun inneholder avslåtte uttak
 */
const harKunAvslåtteUttak = (beregningsresultatUtbetaling: any): boolean => {
  if (!beregningsresultatUtbetaling?.perioder) {
    return false;
  }
  const { perioder } = beregningsresultatUtbetaling;
  const alleUtfall = perioder.flatMap(({ andeler }) => [
    ...andeler.flatMap(({ uttak }) => [...uttak.flatMap(({ utfall }) => utfall)]),
  ]);
  return !alleUtfall.some(utfall => utfall === 'INNVILGET');
};

interface Props {
  api: K9SakProsessApi;
  behandling: Behandling;
  fagsak: Fagsak;
  isReadOnly: boolean;
  submitCallback: (data: any) => Promise<any>;
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
  // Definer panel-identitet som konstanter
  const PANEL_ID = prosessStegCodes.TILKJENT_YTELSE;
  const PANEL_TEKST = 'Behandlingspunkt.TilkjentYtelse';

  // Hent data ved bruk av eksisterende RequestApi-mønster

  const { data: beregningsresultatUtbetaling } = useSuspenseQuery({
    queryKey: ['beregningsresultatUtbetaling', props.behandling?.uuid, props.behandling?.versjon],
    queryFn: () => props.api.getBeregningsresultatMedUtbetaling(props.behandling.uuid),
  });

  const { data: personopplysninger } = useSuspenseQuery({
    queryKey: ['personopplysninger', props.behandling?.uuid, props.behandling?.versjon],
    queryFn: () => props.api.getPersonopplysninger(props.behandling.uuid),
  });

  const { data: aksjonspunkter } = useSuspenseQuery({
    queryKey: ['aksjonspunkter', props.behandling?.uuid, props.behandling?.versjon],
    queryFn: () => props.api.getAksjonspunkter(props.behandling.uuid),
    select: data =>
      data.filter(
        ap => ap.definisjon === k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon.VURDER_TILBAKETREKK,
      ),
  });

  const { data: arbeidsgiverOpplysningerPerId } = useSuspenseQuery({
    queryKey: ['arbeidsgiverOpplysningerPerId', props.behandling?.uuid, props.behandling?.versjon],
    queryFn: () => props.api.getArbeidsgiverOpplysninger(props.behandling.uuid),
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
        submitCallback={props.submitCallback}
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
      submitCallback={props.submitCallback}
      readOnlySubmitButton={readOnlySubmitButton}
    />
  );
}
