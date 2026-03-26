import TilkjentYtelseProsessIndex from '@fpsak-frontend/prosess-tilkjent-ytelse';
import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon,
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus,
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  k9_sak_kontrakt_beregningsresultat_BeregningsresultatMedUtbetaltePeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeBehandlet } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeBehandlet.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { TilkjentYtelseProsessIndex as TilkjentYtelseProsessIndexV2 } from '@k9-sak-web/gui/prosess/tilkjent-ytelse/TilkjentYtelseProsessIndex.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import { useSuspenseQueries } from '@tanstack/react-query';
import { use, useContext } from 'react';
import { K9SakProsessApi } from './api/K9SakProsessApi';
import {
  aksjonspunkterQueryOptions,
  arbeidsgiverOpplysningerQueryOptions,
  beregningsresultatUtbetalingQueryOptions,
  personopplysningerQueryOptions,
} from './api/k9SakQueryOptions';

const PANEL_ID = prosessStegCodes.TILKJENT_YTELSE;

/**
 * Sjekker om beregningsresultatet kun inneholder avslåtte uttak
 */
export const harKunAvslåtteUttak = (
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

export function TilkjentYtelseProsessStegInitPanel(props: Props) {
  const { BRUK_V2_TILKJENT_YTELSE } = use(FeatureTogglesContext);
  const prosessPanelContext = useContext(ProsessPanelContext);

  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);
  const erTilBehandlingEllerBehandlet = !!prosessPanelContext?.erTilBehandlingEllerBehandlet(PANEL_ID);

  const [
    { data: personopplysninger },
    { data: aksjonspunkter },
    { data: arbeidsgiverOpplysningerPerId },
    { data: beregningsresultatUtbetaling },
  ] = useSuspenseQueries({
    queries: [
      personopplysningerQueryOptions(props.api, props.behandling),
      aksjonspunkterQueryOptions(props.api, props.behandling, [
        k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon.VURDER_TILBAKETREKK,
      ]),
      arbeidsgiverOpplysningerQueryOptions(props.api, props.behandling),
      beregningsresultatUtbetalingQueryOptions(props.api, props.behandling, erTilBehandlingEllerBehandlet),
    ],
  });

  if (!erValgt) {
    return null;
  }
  if (!erTilBehandlingEllerBehandlet) {
    return <ProsessStegIkkeBehandlet />;
  }

  if (!beregningsresultatUtbetaling) {
    return null;
  }

  const handleSubmit = async (data: any) => {
    return props.submitCallback(data, aksjonspunkter);
  };

  const harApentAksjonspunkt = aksjonspunkter?.some(
    ap => ap.status === k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET,
  );
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
