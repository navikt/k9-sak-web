import { k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus as aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { Alert, Heading, HStack, VStack } from '@navikt/ds-react';
import { OverstyringKnapp } from '@navikt/ft-ui-komponenter';
import { type JSX, useEffect, useState } from 'react';
import ContentMaxWidth from '../../shared/ContentMaxWidth/ContentMaxWidth';
import Infostripe from './components/infostripe/Infostripe';
import UtsattePerioderStripe from './components/utsattePerioderStripe/UtsattePerioderStripe';
import { useUttakContext } from './context/UttakContext';
import OverstyrUttak from './overstyr-uttak/OverstyrUttak';
import UttaksperiodeListe from './uttaksperiode-liste/UttaksperiodeListe';
import VurderDato from './vurder-dato/VurderDato';
import VurderOverlappendeSak from './vurder-overlappende-sak/VurderOverlappendeSak';

const UttakInnhold = (): JSX.Element => {
  const {
    erOverstyrer,
    aksjonspunktForOverstyringAvUttak,
    aksjonspunktVurderOverlappendeSaker,
    aksjonspunktVentAnnenPSBSak,
    aksjonspunktVurderDatoNyRegelUttak,
    harEtUløstAksjonspunktIUttak,
    setRedigervirkningsdato,
    redigerVirkningsdato,
  } = useUttakContext();

  const [overstyringAktiv, setOverstyringAktiv] = useState<boolean>(aksjonspunktForOverstyringAvUttak !== undefined);

  useEffect(() => {
    setOverstyringAktiv(aksjonspunktForOverstyringAvUttak !== undefined);
  }, [aksjonspunktForOverstyringAvUttak]);

  const toggleOverstyring = () => setOverstyringAktiv(prev => !prev);

  const harOpprettetAksjonspunktVurderDato =
    aksjonspunktVurderDatoNyRegelUttak?.status === aksjonspunktStatus.OPPRETTET ||
    aksjonspunktVurderDatoNyRegelUttak?.status === aksjonspunktStatus.UTFØRT;

  return (
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

      {!harEtUløstAksjonspunktIUttak && <OverstyrUttak overstyringAktiv={overstyringAktiv} />}

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
  );
};

export default UttakInnhold;
