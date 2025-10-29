import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel.svg';
import { BodyShort } from '@navikt/ds-react';
import React from 'react';

import aksjonspunktÅrsaker from '@fpsak-frontend/fakta-arbeidsforhold/src/kodeverk/aksjonspunktÅrsaker';
import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import { FlexColumn, FlexContainer, FlexRow } from './flexGrid';
import Image from './Image';

import styles from './aksjonspunktAvklarArbeidsforholdText.module.css';
import VerticalSpacer from './VerticalSpacer';

interface OwnProps {
  arbeidsforhold: ArbeidsforholdV2;
}

const utledAksjonspunktText = (arbeidsforhold, imUtenArbeidsforhold) => {
  if (imUtenArbeidsforhold) {
    return (
      <FormattedMessage
        id="HelpText.FinnesIkkeIRegisteret"
        values={{
          yrkestittel: `${arbeidsforhold.yrkestittel}(${
            arbeidsforhold.arbeidsforhold.eksternArbeidsforholdId
              ? arbeidsforhold.arbeidsforhold.eksternArbeidsforholdId
              : ''
          })`,
        }}
      />
    );
  }
  if (
    arbeidsforhold.aksjonspunktÅrsaker.some(
      a => a.kode === aksjonspunktÅrsaker.OVERGANG_ARBEIDSFORHOLDS_ID_UNDER_YTELSE,
    )
  ) {
    return Det er mottatt inntektsmeldinger med både arbeidsforhold-Id og virksomhetsnummer for sammelfallende dager eller dager etter hverandre.;
  }
  return Det finnes ingen åpne aksjonspunkter;
};

const AksjonspunktAvklarArbeidsforholdText = ({ intl, arbeidsforhold }: OwnProps & WrappedComponentProps) => {
  const overgangArbeidsforholdsId = arbeidsforhold.aksjonspunktÅrsaker
    .map(k => k.kode)
    .includes(aksjonspunktÅrsaker.OVERGANG_ARBEIDSFORHOLDS_ID_UNDER_YTELSE);
  const imUtenArbeidsforhold = arbeidsforhold.aksjonspunktÅrsaker
    .map(k => k.kode)
    .includes(aksjonspunktÅrsaker.INNTEKTSMELDING_UTEN_ARBEIDSFORHOLD);
  return (
    <FlexContainer>
      <FlexRow>
        <FlexColumn className={styles.message}>
          <Image
            className={styles.image}
            alt={"Aksjonspunkt"}
            src={advarselIkonUrl}
          />
          <BodyShort size="small" className={styles.info}>
            {utledAksjonspunktText(arbeidsforhold, imUtenArbeidsforhold)}
          </BodyShort>
        </FlexColumn>
      </FlexRow>

      {imUtenArbeidsforhold && (
        <>
          <FlexRow>
            <BodyShort size="small" className={styles.info}>
              `Kontakt arbeidsgiver som enten må rapportere riktig:`
              <VerticalSpacer eightPx />
              <li>
                {' '}
                arbeidsforhold i Aa-registeret
              </li>
              <li>
                {' '}
                inntekt i A-ordningen
              </li>
              <li>
                {' '}
                eller sende ny inntektsmelding på riktig arbeidsforhold
              </li>
            </BodyShort>
          </FlexRow>
          <FlexRow>
            {' '}
            Sett behandlingen på vent i 2 uker.
          </FlexRow>
          <FlexRow>
            <div className={styles.hl} />
          </FlexRow>
          <VerticalSpacer eightPx />
          <FlexRow>
            <BodyShort size="small">
              Dersom arbeidsgiver ikke kan rapportere arbeidsforholdet i Aa-registeret:
            </BodyShort>
          </FlexRow>
          <VerticalSpacer eightPx />
          <FlexRow>
            <BodyShort size="small" className={styles.spørsmål}>
              Skal arbeidsforholdet opprettes selv om det ikke finnes i Aa-registeret?
            </BodyShort>
          </FlexRow>
        </>
      )}
      {overgangArbeidsforholdsId && (
        <BodyShort size="small" className={styles.info}>
          Kontakt arbeidsgiver som må sende en ny inntekstmelding med enten riktig arbeidsforhold-Id eller virksomhetsnummer for alle dagene/timene de krever refusjon for.
        </BodyShort>
      )}
    </FlexContainer>
  );
};

export default injectIntl(AksjonspunktAvklarArbeidsforholdText);
