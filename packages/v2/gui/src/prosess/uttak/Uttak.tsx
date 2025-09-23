import React from 'react';
import { useContext, type JSX } from 'react';
import BehandlingUttakBackendClient from './BehandlingUttakBackendClient';
import { K9SakClientContext } from '../../app/K9SakClientContext';
import { UttakContext, type UttakContextType } from './context/UttakContext';
import {
  AksjonspunktDtoDefinisjon,
  AksjonspunktDtoStatus,
  type AksjonspunktDto,
  type BehandlingDto,
  type Periode,
  type UttaksperiodeInfo,
  type UttaksplanMedUtsattePerioder,
} from '@k9-sak-web/backend/k9sak/generated';
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
  behandling: Pick<BehandlingDto, 'uuid' | 'id' | 'versjon' | 'status' | 'sakstype'>;
  erOverstyrer?: boolean;
  aksjonspunkter: AksjonspunktDto[];
  hentBehandling?: (params?: any, keepData?: boolean) => Promise<BehandlingDto>;
  readOnly: boolean;
}

const Uttak = ({
  uttak,
  behandling,
  erOverstyrer = false,
  aksjonspunkter,
  hentBehandling,
  readOnly,
}: UttakProps): JSX.Element => {
  const k9SakClient = useContext(K9SakClientContext);
  const uttakApi = new BehandlingUttakBackendClient(k9SakClient);
  const { refetchBehandling: oppdaterBehandling } = useContext(BehandlingContext);
  const [redigerVirkningsdato, setRedigervirkningsdato] = React.useState<boolean>(false);

  const virkningsdatoUttakNyeRegler = uttak?.virkningsdatoUttakNyeRegler;

  const aksjonspunktVurderOverlappendeSaker = aksjonspunkter?.find(
    aksjonspunkt => AksjonspunktDtoDefinisjon.VURDER_OVERLAPPENDE_SØSKENSAKER === aksjonspunkt.definisjon, // AP: 9292
  );

  const aksjonspunktForOverstyringAvUttak = aksjonspunkter?.find(
    aksjonspunkt => AksjonspunktDtoDefinisjon.OVERSTYRING_AV_UTTAK === aksjonspunkt.definisjon, // AP: 6017
  );

  const aksjonspunktVentAnnenPSBSak = aksjonspunkter?.find(
    aksjonspunkt => AksjonspunktDtoDefinisjon.VENT_ANNEN_PSB_SAK === aksjonspunkt.definisjon, // AP: 9290
  );

  const aksjonspunktVurderDatoNyRegelUttak = aksjonspunkter?.find(
    aksjonspunkt => AksjonspunktDtoDefinisjon.VURDER_DATO_NY_REGEL_UTTAK === aksjonspunkt.definisjon, // AP: 9291
  );

  const harOpprettetAksjonspunktVurderDato =
    aksjonspunktVurderDatoNyRegelUttak?.status === AksjonspunktDtoStatus.OPPRETTET;

  const [overstyringAktiv, setOverstyringAktiv] = React.useState<boolean>(false);
  React.useEffect(() => {
    setOverstyringAktiv(aksjonspunktForOverstyringAvUttak !== undefined);
  }, [aksjonspunktForOverstyringAvUttak]);
  const toggleOverstyring = () => setOverstyringAktiv(!overstyringAktiv);

  const relevanteAksjonspunkter: AksjonspunktDtoDefinisjon[] = [
    AksjonspunktDtoDefinisjon.VURDER_DATO_NY_REGEL_UTTAK,
    AksjonspunktDtoDefinisjon.VENT_ANNEN_PSB_SAK,
    AksjonspunktDtoDefinisjon.VURDER_OVERLAPPENDE_SØSKENSAKER,
  ];

  const harEtUløstAksjonspunktIUttak = aksjonspunkter?.some(
    ap =>
      ap.status === AksjonspunktDtoStatus.OPPRETTET &&
      ap.definisjon !== undefined &&
      relevanteAksjonspunkter.includes(ap.definisjon),
  );

  const uttaksperioder = uttak?.uttaksplan != null ? uttak?.uttaksplan?.perioder : uttak?.simulertUttaksplan?.perioder;

  const uttakValues: UttakContextType = {
    behandling,
    uttak,
    uttaksperioder,
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
    arbeidsgivere: {},
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

        {(harOpprettetAksjonspunktVurderDato || redigerVirkningsdato) && (
          <VurderDato oppdaterBehandling={oppdaterBehandling} />
        )}

        {!aksjonspunktVentAnnenPSBSak && (
          <UttaksperiodeListe
            uttaksperioder={lagUttaksperiodeliste(uttaksperioder)}
            redigerVirkningsdatoFunc={() => setRedigervirkningsdato(true)}
            redigerVirkningsdato={redigerVirkningsdato}
            readOnly={readOnly}
          />
        )}
      </VStack>
    </UttakContext.Provider>
  );
};

export default Uttak;
