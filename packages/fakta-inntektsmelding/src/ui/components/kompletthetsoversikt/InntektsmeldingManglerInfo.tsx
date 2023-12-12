import React from 'react';

import { Accordion, Alert, BodyLong, Heading } from '@navikt/ds-react';
import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import styles from './kompletthetsoversikt.css';

const InntektsmeldingManglerInfo = (): JSX.Element => (
  <>
    <Box marginBottom={Margin.large}>
      <Alert variant="warning" size="medium" className={styles.alert}>
        <Heading spacing size="xsmall" level="3">
          Vurder om du kan fortsette behandlingen uten inntektsmelding.
        </Heading>
        <BodyLong>
          Inntektsmelding mangler for en eller flere arbeidsgivere, eller for ett eller flere arbeidsforhold hos samme
          arbeidsgiver.
        </BodyLong>
      </Alert>
    </Box>
    <Box marginBottom={Margin.large}>
      <Alert variant="info" size="medium">
        <Accordion className={styles.alertAccordion}>
          <Accordion.Item>
            <Accordion.Header>
              <Heading className={styles.alertAccordion__heading} spacing size="xsmall" level="3">
                Når kan du gå videre uten inntektsmelding?
              </Heading>
            </Accordion.Header>
            <Accordion.Content>
              Vurder om du kan gå videre uten alle inntektsmeldinger hvis:
              <ul className={styles.kompletthet__list}>
                <li>Det er rapportert fast og regelmessig lønn de siste 3 månedene før skjæringstidspunktet.</li>
                <li>
                  Det ikke er rapportert lønn hos arbeidsforholdet de siste 3 månedene før skjæringstidspunktet.
                  Beregningsgrunnlaget for denne arbeidsgiveren vil settes til 0,-.
                </li>
                <li>
                  Måneden for skjæringstidspunktet er innrapportert til A-ordningen. Hvis det er innrapportert lavere
                  lønn enn foregående måneder kan det tyde på at arbeidsgiver ikke lenger utbetaler lønn. Det er dermed
                  lavere risiko for at arbeidsgiver vil kreve refusjon.
                </li>
              </ul>
              <Box marginTop={Margin.large}>
                Du bør ikke gå videre uten inntektsmelding hvis:
                <ul className={styles.kompletthet__list}>
                  <li>
                    Det er arbeidsforhold og frilansoppdrag i samme organisasjon (sjekk i Aa-registeret). I disse
                    tilfellene trenger vi inntektsmelding for å skille hva som er arbeidsinntekt og frilansinntekt i
                    samme organisasjon.
                  </li>
                  <li>
                    Måneden for skjæringstidspunktet er innrapportert til A-ordningen, og det er utbetalt full lønn.
                    Dette tyder på at arbeidsgiver forskutterer lønn og vil kreve refusjon. I disse tilfellene bør vi
                    ikke utbetale til bruker, men vente på inntektsmelding.
                  </li>
                </ul>
              </Box>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </Alert>
    </Box>
  </>
);

export default InntektsmeldingManglerInfo;
