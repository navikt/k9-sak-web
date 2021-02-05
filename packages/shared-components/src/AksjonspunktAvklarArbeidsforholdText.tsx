import React, { FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel.svg';

import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import { FlexColumn, FlexContainer, FlexRow } from './flexGrid';
import Image from './Image';

import styles from './aksjonspunktAvklarArbeidsforholdText.less';
import VerticalSpacer from './VerticalSpacer';

interface OwnProps {
  arbeidsforhold: ArbeidsforholdV2;
}

const AksjonspunktAvklarArbeidsforholdText: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  arbeidsforhold,
}) => {
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
              <FormattedMessage
                id="HelpText.FinnesIkkeIRegisteret"
                values={{
                  yrkestittel: `${arbeidsforhold.yrkestittel}
                  (${
                    arbeidsforhold.arbeidsforhold.eksternArbeidsforholdId
                      ? arbeidsforhold.arbeidsforhold.eksternArbeidsforholdId
                      : ''
                  })`,
                }}
              />
            </Normaltekst>
          </FlexColumn>
        </FlexRow>
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
      </FlexContainer>
    </div>
  );
};

export default injectIntl(AksjonspunktAvklarArbeidsforholdText);
