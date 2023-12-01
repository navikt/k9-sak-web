import React from 'react';
import { Heading } from '@navikt/ds-react';
import ContainerContract from '../types/ContainerContract';
import lagUttaksperiodeliste from '../util/uttaksperioder';
import UttaksperiodeListe from './components/uttaksperiode-liste/UttaksperiodeListe';
import ContainerContext from './context/ContainerContext';
import Infostripe from './components/infostripe/Infostripe';
import UtsattePerioderStripe from './components/utsattePerioderStripe/UtsattePerioderStripe';
import VurderDato from './components/vurderDato/VurderDato';
import { aksjonspunktVurderDatoKode, aksjonspunktkodeVentAnnenPSBSakKode } from '../constants/Aksjonspunkter';

interface MainComponentProps {
  containerData: ContainerContract;
}

const MainComponent = ({ containerData }: MainComponentProps): JSX.Element => {
  const { uttaksperioder, aksjonspunktkoder, aksjonspunkter, virkningsdatoUttakNyeRegler } = containerData;
  const [redigerVirkningsdato, setRedigervirkningsdato] = React.useState<boolean>(false);
  const aksjonspunktVurderDato = aksjonspunkter?.find(ap => ap.definisjon.kode === aksjonspunktVurderDatoKode);

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
      </Heading>
      <Infostripe harVentAnnenPSBSakAksjonspunkt={harVentAnnenPSBSakAksjonspunkt} />
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
