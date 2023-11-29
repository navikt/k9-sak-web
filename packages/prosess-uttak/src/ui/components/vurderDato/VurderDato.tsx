import { Accordion, Alert, BodyLong, Label } from '@navikt/ds-react';
import React, { useEffect } from 'react';
import VurderDatoAksjonspunkt from './VurderDatoAksjonspunkt';
import styles from './VurderDato.css';

interface Props {
  avbryt?: () => void;
  initialValues?: {
    virkningsdato: string;
    begrunnelse: string;
  };
}

// eslint-disable-next-line consistent-return
const scrollToVurderDatoContainer = () => {
  const vurderDatoContainer = document.querySelector('#uttakApp');
  if (vurderDatoContainer) {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        vurderDatoContainer.scrollIntoView({ behavior: 'smooth' });
        observer.disconnect();
      }
    });
    observer.observe(vurderDatoContainer);
    return () => {
      observer.disconnect();
    };
  }
};
const VurderDato = ({ avbryt, initialValues }: Props) => {
  useEffect(() => {
    // avbryt er kun definert når vi skal redigere et løst aksjonspunkt
    if (typeof avbryt === 'function') {
      scrollToVurderDatoContainer();
    }
  }, []);
  return (
    <div className={styles.vurderDatoContainer}>
      <Alert variant="warning" size="small" className="mt-4">
        <Label size="small">Vurder hvilken dato endringer i uttak skal gjelde fra</Label>
        <BodyLong size="small">
          Det er lansert endringer for hvordan utbetalingsgrad settes for nye aktiviteter, ikke yrkesaktiv og kun
          ytelse. Vurder hvilken dato endringene skal gjelde fra i denne saken. Dager før denne datoen vil følge gammel
          praksis.
        </BodyLong>
      </Alert>
      <Alert variant="info" className={styles.info}>
        <Accordion className={styles.alertAccordion} indent={false}>
          <Accordion.Item>
            <Accordion.Header>
              <Label size="small">Hva innebærer endringene i uttak?</Label>
            </Accordion.Header>
            <Accordion.Content>
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
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </Alert>
      <VurderDatoAksjonspunkt avbryt={avbryt} initialValues={initialValues} />
    </div>
  );
};

export default VurderDato;
