import React from 'react';

import { Alert, BodyShort, Heading } from '@navikt/ds-react';

import ContainerContract from '../types/ContainerContract';
import lagUttaksperiodeliste from '../util/uttaksperioder';
import UttaksperiodeListe from './components/uttaksperiode-liste/UttaksperiodeListe';
import ContainerContext from './context/ContainerContext';
import Infostripe from './components/infostripe/Infostripe';
import UtsattePerioderStripe from './components/utsattePerioderStripe/UtsattePerioderStripe';
import VurderDato from './components/vurderDato/VurderDato';
import { aksjonspunktVurderDatoKode, aksjonspunktkodeVentAnnenPSBSakKode } from '../constants/Aksjonspunkter';
import OverstyringIkon from './components/overstyrUttakForm/components/OverstyringIkon';
import { OverstyrUttakContextProvider } from './context/OverstyrUttakContext';
import OverstyrUttakForm from './components/overstyrUttakForm/OverstyrUttakForm';

interface MainComponentProps {
  containerData: ContainerContract;
}

const MainComponent = ({ containerData }: MainComponentProps): JSX.Element => {
  const {
    featureToggles,
    uttaksperioder,
    aksjonspunktkoder,
    aksjonspunkter,
    virkningsdatoUttakNyeRegler,
    erOverstyrer,
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

  return (
    <ContainerContext.Provider value={containerData}>
      <Heading size="small" level="1">
        Uttak
        {featureToggles?.OVERSTYRING_UTTAK && (
          <OverstyringIkon erOverstyrer={erOverstyrer} aktiv={overstyringAktiv} toggleOverstyring={toggleOverstyring} />
        )}
      </Heading>

      <Infostripe harVentAnnenPSBSakAksjonspunkt={harVentAnnenPSBSakAksjonspunkt} />

      {harAksjonspunktForOverstyringAvUttak && (
        <Alert variant="warning">
          <Heading spacing size="xsmall" level="3">
            Vurder overstrying av uttaksgrad
          </Heading>
          <BodyShort>
            Det er lagt til overstyring av uttaksgrad i en tidligere periode. Vurder om det skal legges til overstyring
            for nye perioder i uttak.
          </BodyShort>
        </Alert>
      )}

      <OverstyrUttakContextProvider>
        {erOverstyrer && overstyringAktiv && <OverstyrUttakForm />}
      </OverstyrUttakContextProvider>

      <UtsattePerioderStripe />
      {harAksjonspunktVurderDatoMedStatusOpprettet && <VurderDato />}
      {virkningsdatoUttakNyeRegler && redigerVirkningsdato && (
        <VurderDato
          avbryt={() => setRedigervirkningsdato(false)}
          initialValues={{
            begrunnelse: aksjonspunktVurderDato?.begrunnelse,
            virkningsdato: virkningsdatoUttakNyeRegler,
          }}
        />
      )}
      {!harVentAnnenPSBSakAksjonspunkt && (
        <UttaksperiodeListe
          uttaksperioder={lagUttaksperiodeliste(uttaksperioder)}
          redigerVirkningsdatoFunc={() => setRedigervirkningsdato(true)}
          redigerVirkningsdato={redigerVirkningsdato}
        />
      )}
    </ContainerContext.Provider>
  );
};

export default MainComponent;
