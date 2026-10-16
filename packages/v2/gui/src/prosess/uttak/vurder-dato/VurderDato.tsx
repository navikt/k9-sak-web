import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { Alert, BodyLong, Label, ReadMore, VStack } from '@navikt/ds-react';
import { useEffect } from 'react';
import { useUttakContext } from '../context/UttakContext.js';
import styles from './VurderDato.module.css';
import VurderDatoAksjonspunkt from './VurderDatoAksjonspunkt.js';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useUttakApi } from '../api/UttakApiContext.js';
import { uttakQueryOptions } from '../api/uttakQueryOptions.js';

const scrollToVurderDatoContainer = () => {
  const vurderDatoContainer = document.querySelector('#uttakApp');
  if (vurderDatoContainer) {
    const observer = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting) {
        vurderDatoContainer.scrollIntoView({ behavior: 'smooth' });
        observer.disconnect();
      }
    });
    observer.observe(vurderDatoContainer);
    return () => {
      observer.disconnect();
    };
  }
  return undefined;
};
interface VurderDatoProps {
  redigerVirkningsdato: boolean;
  lukkRedigering: () => void;
}

const VurderDato = ({ redigerVirkningsdato, lukkRedigering }: VurderDatoProps) => {
  const { aksjonspunkter } = useUttakContext();
  const uttakApi = useUttakApi();
  const { behandling } = useUttakContext();
  const { data: uttak } = useSuspenseQuery(uttakQueryOptions(uttakApi, behandling.uuid, behandling.versjon));
  const virkningsdatoUttakNyeRegler = uttak?.virkningsdatoUttakNyeRegler;
  const aksjonspunktVurderDatoNyRegelUttak = aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK,
  );

  useEffect(() => {
    if (virkningsdatoUttakNyeRegler) {
      scrollToVurderDatoContainer();
    }
  }, [virkningsdatoUttakNyeRegler]);

  if (!aksjonspunktVurderDatoNyRegelUttak) {
    return false;
  }

  // Endringsdato er allerede satt - vis kun etter at «Rediger aksjonspunkt» er trykket i uttaksperiodetabellen
  if (virkningsdatoUttakNyeRegler && !redigerVirkningsdato) {
    return false;
  }

  return (
    <VStack className={styles.vurderDatoContainer} gap="space-20">
      <Alert variant="warning" size="small">
        <Label size="small">Vurder hvilken dato endringer i uttak skal gjelde fra</Label>
        <VStack gap="space-12">
          <BodyLong size="small">
            Det er lansert endringer for hvordan utbetalingsgrad settes for nye aktiviteter, ikke yrkesaktiv og kun
            ytelse. Vurder hvilken dato endringene skal gjelde fra i denne saken. Dager før denne datoen vil følge
            gammel praksis.
          </BodyLong>
          <ReadMore size="small" header="Hva innebærer endringene i uttak?" data-color="accent">
            <BodyLong size="small">
              Før endring:
              <ol>
                <li>Nye aktiviteter blir tatt med ved utregning av utbetalingsgrad og søkers uttaksgrad.</li>
                <li>{`"Ikke-yrkesaktiv" og "Kun ytelse" har samme utbetalingsgrad som andre aktiviteter.`}</li>
              </ol>
              Etter endring:
              <ol>
                <li>
                  Nye aktiviteter blir ikke tatt med i utregning av utbetalingsgrad eller søkers uttaksgrad. De vil
                  alltid stå med 0% utbetalingsgrad.
                </li>
                <li>
                  {`"Ikke-yrkesaktiv" og "Kun ytelse" får alltid 100% som utbetalingsgrad, hvis det ikke er
                            reduksjon grunnet tilsyn.`}
                </li>
              </ol>
            </BodyLong>
          </ReadMore>
        </VStack>
      </Alert>
      <VurderDatoAksjonspunkt lukkRedigering={lukkRedigering} />
    </VStack>
  );
};

export default VurderDato;
