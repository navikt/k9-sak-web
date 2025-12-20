import { ProsessDefaultInitPanel } from '@k9-sak-web/gui/behandling/prosess/ProsessDefaultInitPanel.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { TilkjentYtelseProsessIndex as TilkjentYtelseProsessIndexV2 } from '@k9-sak-web/gui/prosess/tilkjent-ytelse/TilkjentYtelseProsessIndex.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { useContext, useMemo } from 'react';

import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import { useQuery } from '@tanstack/react-query';
import { K9SakProsessApi } from './K9SakProsessApi';

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
  readOnlySubmitButton: boolean;
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
  const context = useContext(ProsessPanelContext);
  // Definer panel-identitet som konstanter
  const PANEL_ID = prosessStegCodes.TILKJENT_YTELSE;
  const PANEL_TEKST = 'Behandlingspunkt.TilkjentYtelse';

  // Hent data ved bruk av eksisterende RequestApi-mønster

  const { data: beregningsresultatUtbetaling } = useQuery({
    queryKey: ['beregningsresultatUtbetaling', props.behandling?.uuid],
    queryFn: () => props.api.getBeregningsresultatMedUtbetaling(props.behandling.uuid),
  });

  const { data: personopplysninger } = useQuery({
    queryKey: ['personopplysninger', props.behandling?.uuid],
    queryFn: () => props.api.getPersonopplysninger(props.behandling.uuid),
  });

  const { data: aksjonspunkter } = useQuery({
    queryKey: ['aksjonspunkter', props.behandling?.uuid],
    queryFn: () => props.api.getAksjonspunkter(props.behandling.uuid),
  });

  const { data: arbeidsgiverOpplysningerPerId } = useQuery({
    queryKey: ['arbeidsgiverOpplysningerPerId', props.behandling?.uuid],
    queryFn: () => props.api.getArbeidsgiverOpplysninger(props.behandling.uuid),
  });

  // Beregn paneltype basert på beregningsresultat (for menystatusindikator)
  const panelType = useMemo((): ProcessMenuStepType => {
    // Hvis ingen data, vis default (ingen status)
    if (!beregningsresultatUtbetaling) {
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

  // Render kun hvis panelet er valgt (injisert av ProsessMeny)
  if (!erValgt) {
    return null;
  }

  // Ikke vis panelet hvis data ikke er lastet ennå
  // TODO: Bruk Suspense for datahenting i fremtiden
  if (
    !beregningsresultatUtbetaling ||
    !personopplysninger ||
    !aksjonspunkter ||
    !arbeidsgiverOpplysningerPerId?.arbeidsgivere
  ) {
    return null;
  }

  return (
    // Bruker ProsessDefaultInitPanel for å hente standard props og rendre legacy panel
    <ProsessDefaultInitPanel urlKode={prosessStegCodes.TILKJENT_YTELSE} tekstKode="Behandlingspunkt.TilkjentYtelse">
      {() => {
        // Legacy komponent krever deep copy og kodeverkkonvertering

        return (
          <TilkjentYtelseProsessIndexV2
            behandling={{ uuid: props.behandling.uuid }}
            beregningsresultat={beregningsresultatUtbetaling}
            personopplysninger={personopplysninger}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId.arbeidsgivere}
            aksjonspunkter={aksjonspunkter}
            isReadOnly={props.isReadOnly}
            submitCallback={props.submitCallback}
            readOnlySubmitButton={props.readOnlySubmitButton}
          />
        );
      }}
    </ProsessDefaultInitPanel>
  );
}
