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
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { useUttakContext } from './context/UttakContext.js';
import { finnAksjonspunkt } from '../../utils/aksjonspunktUtils.js';
import { harEtUløstAksjonspunktIUttak } from './utils/aksjonspunkter.js';
import OverstyrUttak from './overstyr-uttak/OverstyrUttak.js';
import UttaksperiodeListe from './uttaksperiode-liste/UttaksperiodeListe.js';
import VurderDato from './vurder-dato/VurderDato.js';
import VurderOverlappendeSak from './vurder-overlappende-sak/VurderOverlappendeSak.js';

const UttakInnhold = (): JSX.Element => {
  const { erOverstyrer, aksjonspunkter, behandling } = useUttakContext();
  const [redigerVirkningsdato, setRedigervirkningsdato] = useState(false);
  const aksjonspunktForOverstyringAvUttak = finnAksjonspunkt(
    aksjonspunkter,
    AksjonspunktDefinisjon.OVERSTYRING_AV_UTTAK,
  );
  const aksjonspunktVurderOverlappendeSaker = finnAksjonspunkt(
    aksjonspunkter,
    AksjonspunktDefinisjon.VURDER_OVERLAPPENDE_SØSKENSAKER,
  );
  const aksjonspunktVentAnnenPSBSak = finnAksjonspunkt(aksjonspunkter, AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK);
  const aksjonspunktVurderDatoNyRegelUttak = finnAksjonspunkt(
    aksjonspunkter,
    AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK,
  );
  const harUløstAksjonspunktIUttak = harEtUløstAksjonspunktIUttak(aksjonspunkter, behandling.sakstype);

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
      {harUløstAksjonspunktIUttak && overstyringAktiv && (
        <ContentMaxWidth>
          <Alert variant="warning" size="small">
            Aktive aksjonspunkter i uttak må løses før uttak kan overstyres.
          </Alert>
        </ContentMaxWidth>
      )}
      <VStack gap="space-32">
        {aksjonspunktVurderOverlappendeSaker && <VurderOverlappendeSak />}
        <UtsattePerioderStripe />
        {(harOpprettetAksjonspunktVurderDato || redigerVirkningsdato) && (
          <VurderDato
            redigerVirkningsdato={redigerVirkningsdato}
            lukkRedigering={() => setRedigervirkningsdato(false)}
          />
        )}
        {!harUløstAksjonspunktIUttak && <OverstyrUttak overstyringAktiv={overstyringAktiv} />}
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
