import React, { ReactNode, FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel.svg';

import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import aksjonspunktÅrsaker from '@fpsak-frontend/fakta-arbeidsforhold/src/kodeverk/aksjonspunktÅrsaker';
import { FlexColumn, FlexContainer, FlexRow } from './flexGrid';
import Image from './Image';

import styles from './aksjonspunktAvklarArbeidsforholdText.less';
import VerticalSpacer from './VerticalSpacer';

interface OwnProps {
  children: string[] | ReactNode[];
  isAksjonspunktOpen: boolean;
  marginBottom?: boolean;
  arbeidsforhold: ArbeidsforholdV2;
}

const utledAksjonspunktText = (arbeidsforhold, imUtenArbeidsforhold) => {
  if (imUtenArbeidsforhold) {
    return (
      <FormattedMessage
        id="HelpText.FinnesIkkeIRegisteret"
        values={{
          yrkestittel: `${arbeidsforhold.yrkestittel}(${arbeidsforhold.arbeidsforhold.eksternArbeidsforholdId})`,
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

const AksjonspunktAvklarArbeidsforholdText: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  arbeidsforhold,
}) => {
  const overgangArbeidsforholdsId = arbeidsforhold.aksjonspunktÅrsaker
    .map(k => k.kode)
    .includes(aksjonspunktÅrsaker.OVERGANG_ARBEIDSFORHOLDS_ID_UNDER_YTELSE);
  const imUtenArbeidsforhold = arbeidsforhold.aksjonspunktÅrsaker
    .map(k => k.kode)
    .includes(aksjonspunktÅrsaker.INNTEKTSMELDING_UTEN_ARBEIDSFORHOLD);
  return (
    <div>
      <FlexContainer>
        <FlexRow>
          <FlexColumn className={styles.message}>
            <Image
              className={styles.image}
              alt={intl.formatMessage({ id: 'HelpText.Aksjonspunkt' })}
              src={advarselIkonUrl}
            />
            <Normaltekst className={styles.info}>
              {utledAksjonspunktText(arbeidsforhold, imUtenArbeidsforhold)}
            </Normaltekst>
          </FlexColumn>
        </FlexRow>

        {imUtenArbeidsforhold && (
          <>
            <FlexRow>
              <Normaltekst className={styles.info}>
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
                <VerticalSpacer eightPx />
                <FormattedMessage id="HelpText.SettPaaVent" />
              </Normaltekst>
            </FlexRow>
            <FlexRow>
              <div className={styles.hl} />
            </FlexRow>
            <VerticalSpacer eightPx />
            <FlexRow>
              <Normaltekst>
                <FormattedMessage id="HelpText.DersomIkkeKanRapporteres" />
              </Normaltekst>
            </FlexRow>
            <VerticalSpacer eightPx />
            <FlexRow>
              <Normaltekst className={styles.spørsmål}>
                <FormattedMessage id="PersonAksjonspunktText.SkalLeggesTil" />
              </Normaltekst>
            </FlexRow>
          </>
        )}
        {overgangArbeidsforholdsId && (
          <Normaltekst className={styles.info}>
            <FormattedMessage id="HelpText.TaKontaktOvergangArbeidsforholdId" />
          </Normaltekst>
        )}
      </FlexContainer>
    </div>
  );
};

export default injectIntl(AksjonspunktAvklarArbeidsforholdText);
