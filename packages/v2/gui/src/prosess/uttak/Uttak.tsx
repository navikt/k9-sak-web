import React from 'react';
import { useContext, type JSX } from 'react';
import BehandlingUttakBackendClient from './BehandlingUttakBackendClient';
import { UttakContext, type UttakContextType } from './context/UttakContext';

import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon,
  type k9_sak_web_app_tjenester_behandling_uttak_UttaksplanMedUtsattePerioder as UttaksplanMedUtsattePerioder,
  type pleiepengerbarn_uttak_kontrakter_UttaksperiodeInfo as UttaksperiodeInfo,
  type k9_sak_typer_Periode as Periode,
  type k9_sak_kontrakt_behandling_BehandlingDto as Behandling,
  type k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as Aksjonspunkt,
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus as aksjonspunktStatus,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { BehandlingContext } from '@k9-sak-web/gui/context/BehandlingContext.js';
import { Alert, Heading, HStack, VStack } from '@navikt/ds-react';
import ContentMaxWidth from '../../shared/ContentMaxWidth/ContentMaxWidth';
import UtsattePerioderStripe from './components/utsattePerioderStripe/UtsattePerioderStripe';
import OverstyrUttak from './overstyr-uttak/OverstyrUttak';
import { OverstyringKnapp } from '@navikt/ft-ui-komponenter';
import VurderOverlappendeSak from './vurder-overlappende-sak/VurderOverlappendeSak';
import UttaksperiodeListe from './uttaksperiode-liste/UttaksperiodeListe';
import lagUttaksperiodeliste from './utils/uttaksperioder';
import Infostripe from './components/infostripe/Infostripe';
import VurderDato from './vurder-dato/VurderDato';

/*
 * Utvider UttaksperiodeInfo med flagg for opphold til neste periode
 */
export interface UttaksperiodeBeriket extends UttaksperiodeInfo {
  harOppholdTilNestePeriode?: boolean;
  periode: Periode;
}

interface UttakProps {
  uttak: UttaksplanMedUtsattePerioder;
  behandling: Pick<Behandling, 'uuid' | 'id' | 'versjon' | 'status' | 'sakstype'>;
  erOverstyrer?: boolean;
  aksjonspunkter: Aksjonspunkt[];
  hentBehandling?: (params?: any, keepData?: boolean) => Promise<Behandling>;
  readOnly: boolean;
  relevanteAksjonspunkter: AksjonspunktDefinisjon[];
}

const Uttak = ({
  uttak,
  behandling,
  erOverstyrer = false,
  aksjonspunkter,
  hentBehandling,
  relevanteAksjonspunkter,
  readOnly,
}: UttakProps): JSX.Element => {
  const uttakApi = React.useMemo(() => new BehandlingUttakBackendClient(), []);
  const { refetchBehandling: oppdaterBehandling } = useContext(BehandlingContext);
  const [redigerVirkningsdato, setRedigervirkningsdato] = React.useState<boolean>(false);

  const virkningsdatoUttakNyeRegler = uttak?.virkningsdatoUttakNyeRegler;

  const aksjonspunkterMap = React.useMemo(() => {
    const map = new Map<AksjonspunktDefinisjon, Aksjonspunkt>();
    for (const ap of aksjonspunkter ?? []) {
      if (ap.definisjon) {
        map.set(ap.definisjon, ap);
      }
    }
    return map;
  }, [aksjonspunkter]);

  const aksjonspunktForOverstyringAvUttak = aksjonspunkterMap.get(AksjonspunktDefinisjon.OVERSTYRING_AV_UTTAK); // AP: 6017
  const aksjonspunktVurderOverlappendeSaker = aksjonspunkterMap.get(
    AksjonspunktDefinisjon.VURDER_OVERLAPPENDE_SØSKENSAKER,
  ); // AP: 9292
  const aksjonspunktVentAnnenPSBSak = aksjonspunkterMap.get(AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK); // AP: 9290
  const aksjonspunktVurderDatoNyRegelUttak = aksjonspunkterMap.get(AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK); // AP: 9291

  const harOpprettetAksjonspunktVurderDato =
    aksjonspunktVurderDatoNyRegelUttak?.status === aksjonspunktStatus.OPPRETTET;

  const [overstyringAktiv, setOverstyringAktiv] = React.useState<boolean>(false);
  React.useEffect(() => {
    setOverstyringAktiv(aksjonspunktForOverstyringAvUttak !== undefined);
  }, [aksjonspunktForOverstyringAvUttak]);
  const toggleOverstyring = () => setOverstyringAktiv(!overstyringAktiv);

  const harEtUløstAksjonspunktIUttak = React.useMemo(
    () =>
      (aksjonspunkter ?? []).some(
        ap =>
          ap.status === aksjonspunktStatus.OPPRETTET &&
          ap.definisjon !== undefined &&
          ap.definisjon !== AksjonspunktDefinisjon.OVERSTYRING_AV_UTTAK &&
          relevanteAksjonspunkter.includes(ap.definisjon),
      ),
    [aksjonspunkter, relevanteAksjonspunkter],
  );

  const uttaksperioder = uttak?.uttaksplan != null ? uttak?.uttaksplan?.perioder : uttak?.simulertUttaksplan?.perioder;
  const [uttaksperiodeListe, setUttaksperiodeListe] = React.useState(lagUttaksperiodeliste(uttaksperioder));
  React.useEffect(() => {
    const perioder = uttak?.uttaksplan != null ? uttak?.uttaksplan?.perioder : uttak?.simulertUttaksplan?.perioder;
    setUttaksperiodeListe(lagUttaksperiodeliste(perioder));
  }, [uttak]);

  const uttakValues: UttakContextType = {
    behandling,
    uttak,
    uttakApi,
    hentBehandling,
    erOverstyrer,
    harEtUløstAksjonspunktIUttak,
    aksjonspunktForOverstyringAvUttak,
    aksjonspunktVurderOverlappendeSaker,
    aksjonspunktVentAnnenPSBSak,
    aksjonspunktVurderDatoNyRegelUttak,
    readOnly,
    oppdaterBehandling,
    virkningsdatoUttakNyeRegler,
    perioderTilVurdering: uttak?.perioderTilVurdering || [],
    setRedigervirkningsdato,
    arbeidsgivere: undefined,
    uttaksperiodeListe,
    setUttaksperiodeListe,
  };

  if (!uttak) {
    return <></>;
  }

  return (
    <UttakContext.Provider value={uttakValues}>
      <VStack gap="4">
        <HStack justify="start">
          <Heading size="small" level="1">
            Uttak
          </Heading>
          {erOverstyrer && <OverstyringKnapp erOverstyrt={overstyringAktiv} onClick={toggleOverstyring} />}
        </HStack>

        {aksjonspunktVentAnnenPSBSak && <Infostripe />}

        {harEtUløstAksjonspunktIUttak && overstyringAktiv && (
          <ContentMaxWidth>
            <Alert variant="warning" size="small">
              Aktive aksjonspunkter i uttak må løses før uttak kan overstyres.
            </Alert>
          </ContentMaxWidth>
        )}

        {!harEtUløstAksjonspunktIUttak && overstyringAktiv && <OverstyrUttak />}

        {aksjonspunktVurderOverlappendeSaker && <VurderOverlappendeSak />}

        <UtsattePerioderStripe />

        {(harOpprettetAksjonspunktVurderDato || redigerVirkningsdato) && <VurderDato />}

        {!aksjonspunktVentAnnenPSBSak && (
          <UttaksperiodeListe
            redigerVirkningsdatoFunc={() => setRedigervirkningsdato(true)}
            redigerVirkningsdato={redigerVirkningsdato}
          />
        )}
      </VStack>
    </UttakContext.Provider>
  );
};

export default Uttak;
