import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { Alert, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { InformationSquareIcon } from '@navikt/aksel-icons';
import { OverstyringKnapp } from '@navikt/ft-ui-komponenter';
import { useContext, useEffect, useState, type JSX } from 'react';
import ContentMaxWidth from '../../shared/ContentMaxWidth/ContentMaxWidth.js';
import FeatureTogglesContext from '../../featuretoggles/FeatureTogglesContext.js';
import EndringerIUttakDrawer from './components/endringer-i-uttak/EndringerIUttakDialog.js';
import Infostripe from './components/infostripe/Infostripe.js';
import UtsattePerioderStripe from './components/utsattePerioderStripe/UtsattePerioderStripe.js';
import { useUttakContext } from './context/UttakContext.js';
import OverstyrUttak from './overstyr-uttak/OverstyrUttak.js';
import UttaksperiodeListe from './uttaksperiode-liste/UttaksperiodeListe.js';
import VurderDato from './vurder-dato/VurderDato.js';
import VurderOverlappendeSak from './vurder-overlappende-sak/VurderOverlappendeSak.js';

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
  const [visEndringerIUttak, setVisEndringerIUttak] = useState(false);
  const { NORMALARBEIDSTID_UTTAK } = useContext(FeatureTogglesContext);

  useEffect(() => {
    setOverstyringAktiv(aksjonspunktForOverstyringAvUttak !== undefined);
  }, [aksjonspunktForOverstyringAvUttak]);

  const toggleOverstyring = () => setOverstyringAktiv(prev => !prev);

  const harOpprettetAksjonspunktVurderDato =
    aksjonspunktVurderDatoNyRegelUttak?.status === aksjonspunktStatus.OPPRETTET ||
    aksjonspunktVurderDatoNyRegelUttak?.status === aksjonspunktStatus.UTFØRT;

  return (
    <VStack gap="space-16">
      <HStack justify="space-between">
        <HStack>
          <Heading size="small" level="1">
            Uttak
          </Heading>
          {erOverstyrer && <OverstyringKnapp erOverstyrt={overstyringAktiv} onClick={toggleOverstyring} />}
        </HStack>
        {NORMALARBEIDSTID_UTTAK && (
          <Button
            variant="tertiary"
            size="small"
            icon={<InformationSquareIcon aria-hidden />}
            onClick={() => setVisEndringerIUttak(true)}
          >
            Endringer i uttak
          </Button>
        )}
      </HStack>
      {NORMALARBEIDSTID_UTTAK && (
        <EndringerIUttakDrawer open={visEndringerIUttak} onClose={() => setVisEndringerIUttak(false)} />
      )}
      {aksjonspunktVentAnnenPSBSak && <Infostripe />}
      {harEtUløstAksjonspunktIUttak && overstyringAktiv && (
        <ContentMaxWidth>
          <Alert variant="warning" size="small">
            Aktive aksjonspunkter i uttak må løses før uttak kan overstyres.
          </Alert>
        </ContentMaxWidth>
      )}
      <VStack gap="space-32">
        {aksjonspunktVurderOverlappendeSaker && <VurderOverlappendeSak />}
        <UtsattePerioderStripe />
        {(harOpprettetAksjonspunktVurderDato || redigerVirkningsdato) && <VurderDato />}
        {!harEtUløstAksjonspunktIUttak && <OverstyrUttak overstyringAktiv={overstyringAktiv} />}
        {!aksjonspunktVentAnnenPSBSak && (
          <UttaksperiodeListe
            redigerVirkningsdatoFunc={() => setRedigervirkningsdato(true)}
            redigerVirkningsdato={redigerVirkningsdato}
            visEndringerIUttakFunc={() => setVisEndringerIUttak(true)}
          />
        )}
      </VStack>
    </VStack>
  );
};

export default UttakInnhold;
