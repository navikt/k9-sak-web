import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel.svg';
import { BodyShort } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';

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
    return <FormattedMessage id="HelpText.OvergangAbedsforholdsId" />;
  }
  return <FormattedMessage id="HelpText.IngenAksjonspunkt" />;
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
            alt={intl.formatMessage({ id: 'HelpText.Aksjonspunkt' })}
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
              <FormattedMessage id="HelpText.TaKontakt" values={{ li: <li />, br: <br /> }} />
              <VerticalSpacer eightPx />
              <li>
                {' '}
                <FormattedMessage id="HelpText.Option1" />
              </li>
              <li>
                {' '}
                <FormattedMessage id="HelpText.Option2" />
              </li>
              <li>
                {' '}
                <FormattedMessage id="HelpText.Option3" />
              </li>
            </BodyShort>
          </FlexRow>
          <FlexRow>
            {' '}
            <FormattedMessage id="HelpText.SettPaaVent" />
          </FlexRow>
          <FlexRow>
            <div className={styles.hl} />
          </FlexRow>
          <VerticalSpacer eightPx />
          <FlexRow>
            <BodyShort size="small">
              <FormattedMessage id="HelpText.DersomIkkeKanRapporteres" />
            </BodyShort>
          </FlexRow>
          <VerticalSpacer eightPx />
          <FlexRow>
            <BodyShort size="small" className={styles.spørsmål}>
              <FormattedMessage id="PersonAksjonspunktText.SkalLeggesTil" />
            </BodyShort>
          </FlexRow>
        </>
      )}
      {overgangArbeidsforholdsId && (
        <BodyShort size="small" className={styles.info}>
          <FormattedMessage id="HelpText.TaKontaktOvergangArbeidsforholdId" />
        </BodyShort>
      )}
    </FlexContainer>
  );
};

export default injectIntl(AksjonspunktAvklarArbeidsforholdText);
