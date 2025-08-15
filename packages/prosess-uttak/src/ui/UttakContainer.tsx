import { k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus as AksjonspunktStatus } from '@k9-sak-web/backend/k9sak/generated';
import ContentMaxWidth from '@k9-sak-web/gui/shared/ContentMaxWidth/ContentMaxWidth.js';
import { Alert, HStack, Heading, VStack } from '@navikt/ds-react';
import { OverstyringKnapp } from '@navikt/ft-ui-komponenter';
import React, { useContext, type JSX } from 'react';
import {
  aksjonspunktVurderDatoKode,
  aksjonspunktVurderOverlappendeYtelsekode,
  aksjonspunktkodeVentAnnenPSBSakKode,
} from '../constants/Aksjonspunkter';
import ContainerContract from '../types/ContainerContract';
import lagUttaksperiodeliste from '../util/uttaksperioder';

import { K9SakClientContext } from '@k9-sak-web/gui/app/K9SakClientContext.js';
import BehandlingUttakBackendClient from '@k9-sak-web/gui/prosess/uttak/BehandlingUttakBackendClient.js';
import UtsattePerioderStripe from '@k9-sak-web/gui/prosess/uttak/components/utsattePerioderStripe/UtsattePerioderStripe.js';
import OverstyrUttak from '@k9-sak-web/gui/prosess/uttak/overstyr-uttak/OverstyrUttak.js';
import Infostripe from './components/infostripe/Infostripe';
import UttaksperiodeListe from './components/uttaksperiode-liste/UttaksperiodeListe';
import VurderDato from '@k9-sak-web/gui/prosess/uttak/vurder-dato/VurderDato.js';
import ContainerContext from './context/ContainerContext';
import styles from './mainComponent.module.css';

interface MainComponentProps {
  containerData: ContainerContract;
}

const UttakContainer = ({ containerData }: MainComponentProps): JSX.Element => {
  const {
    uttaksperioder,
    inntektsgraderinger,
    aksjonspunktkoder,
    aksjonspunkter,
    virkningsdatoUttakNyeRegler,
    erOverstyrer = false,
    readOnly,
    vurderOverlappendeSakComponent,
    utsattePerioder,
    behandling,
    perioderTilVurdering,
    hentBehandling,
    oppdaterBehandling,
  } = containerData;

  const [redigerVirkningsdato, setRedigervirkningsdato] = React.useState<boolean>(false);
  const aksjonspunktVurderDato = aksjonspunkter?.find(ap => ap.definisjon.kode === aksjonspunktVurderDatoKode);

  const harAksjonspunktForOverstyringAvUttak = aksjonspunktkoder.includes('6017');
  const [overstyringAktiv, setOverstyringAktiv] = React.useState<boolean>(harAksjonspunktForOverstyringAvUttak);
  const toggleOverstyring = () => setOverstyringAktiv(!overstyringAktiv);

  const harVentAnnenPSBSakAksjonspunkt = aksjonspunktkoder?.some(
    aksjonspunktkode => aksjonspunktkode === aksjonspunktkodeVentAnnenPSBSakKode,
  );
  const harAksjonspunktVurderDatoMedStatusOpprettet = aksjonspunktkoder?.some(
    aksjonspunktkode => aksjonspunktkode === aksjonspunktVurderDatoKode,
  );
  const harEtUløstAksjonspunktIUttak = aksjonspunkter?.some(
    ap =>
      ap.status.kode === AksjonspunktStatus.OPPRETTET &&
      [
        aksjonspunktVurderDatoKode,
        aksjonspunktkodeVentAnnenPSBSakKode,
        aksjonspunktVurderOverlappendeYtelsekode,
      ].includes(ap.definisjon.kode),
  );

  const k9SakClient = useContext(K9SakClientContext);
  const uttakApi = new BehandlingUttakBackendClient(k9SakClient);

  return (
    <ContainerContext.Provider value={containerData}>
      <VStack gap="space-16">
        <HStack justify="start" className={styles.overstyringsHeader}>
          <Heading size="small" level="1">
            Uttak
          </Heading>
          {erOverstyrer && <OverstyringKnapp erOverstyrt={overstyringAktiv} onClick={toggleOverstyring} />}
        </HStack>
        <Infostripe harVentAnnenPSBSakAksjonspunkt={harVentAnnenPSBSakAksjonspunkt} />
        {harEtUløstAksjonspunktIUttak && overstyringAktiv && (
          <ContentMaxWidth>
            <Alert variant="warning" size="small">
              Aktive aksjonspunkter i uttak må løses før uttak kan overstyres.
            </Alert>
          </ContentMaxWidth>
        )}

        {!harEtUløstAksjonspunktIUttak && (
          <OverstyrUttak // Flyttet til v2
            behandling={behandling}
            overstyringAktiv={overstyringAktiv}
            erOverstyrer={erOverstyrer}
            perioderTilVurdering={perioderTilVurdering ?? []}
            harAksjonspunktForOverstyringAvUttak={harAksjonspunktForOverstyringAvUttak}
            api={uttakApi}
            hentBehandling={hentBehandling}
          />
        )}

        {vurderOverlappendeSakComponent && (
          <div className={styles.overlappendeSakContainer}>{vurderOverlappendeSakComponent}</div>
        )}

        {/* Flyttet til v2 */}
        <UtsattePerioderStripe utsattePerioder={utsattePerioder} />

        {/* Allerede løst og har klikket rediger, eller har uløst aksjonspunkt */}
        {((virkningsdatoUttakNyeRegler && redigerVirkningsdato) ||
          harAksjonspunktVurderDatoMedStatusOpprettet ||
          (readOnly && aksjonspunktVurderDato)) && (
          <VurderDato
            avbryt={
              virkningsdatoUttakNyeRegler && redigerVirkningsdato ? () => setRedigervirkningsdato(false) : undefined
            }
            initialValues={{
              begrunnelse: aksjonspunktVurderDato?.begrunnelse ?? '',
              virkningsdato: virkningsdatoUttakNyeRegler ?? '',
            }}
            readOnly={readOnly}
            api={uttakApi}
            behandling={behandling}
            oppdaterBehandling={oppdaterBehandling}
          />
        )}
        {!harVentAnnenPSBSakAksjonspunkt && (
          <UttaksperiodeListe
            uttaksperioder={lagUttaksperiodeliste(uttaksperioder, inntektsgraderinger ?? [])}
            redigerVirkningsdatoFunc={() => setRedigervirkningsdato(true)}
            redigerVirkningsdato={redigerVirkningsdato}
            readOnly={readOnly}
          />
        )}
      </VStack>
    </ContainerContext.Provider>
  );
};

export default UttakContainer;
