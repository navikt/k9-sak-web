import { k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { Accordion, Alert, BodyLong, Label } from '@navikt/ds-react';
import { useEffect } from 'react';
import { useUttakContext } from '../context/UttakContext';
import styles from './VurderDato.module.css';
import VurderDatoAksjonspunkt from './VurderDatoAksjonspunkt';

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
const VurderDato = () => {
  const { virkningsdatoUttakNyeRegler, harAksjonspunkt, readOnly, aksjonspunktVurderDatoNyRegelUttak } =
    useUttakContext();

  useEffect(() => {
    if (virkningsdatoUttakNyeRegler) {
      scrollToVurderDatoContainer();
    }
  }, [virkningsdatoUttakNyeRegler]);

  if (
    !harAksjonspunkt(AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK) &&
    !(readOnly && harAksjonspunkt(AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK))
  ) {
    return false;
  }

  const initialValues = {
    begrunnelse: aksjonspunktVurderDatoNyRegelUttak?.begrunnelse ?? '',
    virkningsdato: virkningsdatoUttakNyeRegler ?? '',
  };

  return (
    <div className={styles['vurderDatoContainer']}>
      <Alert variant="warning" size="small" className="mt-4">
        <Label size="small">Vurder hvilken dato endringer i uttak skal gjelde fra</Label>
        <BodyLong size="small">
          Det er lansert endringer for hvordan utbetalingsgrad settes for nye aktiviteter, ikke yrkesaktiv og kun
          ytelse. Vurder hvilken dato endringene skal gjelde fra i denne saken. Dager før denne datoen vil følge gammel
          praksis.
        </BodyLong>
      </Alert>
      <Alert variant="info" className={styles['info']}>
        <Accordion className={styles['alertAccordion']} indent={false}>
          <Accordion.Item className="!shadow-none">
            <Accordion.Header>
              <Label size="small">Hva innebærer endringene i uttak?</Label>
            </Accordion.Header>
            <Accordion.Content>
              <BodyLong as="div" size="small">
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
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </Alert>
      <VurderDatoAksjonspunkt initialValues={initialValues} />
    </div>
  );
};

export default VurderDato;
