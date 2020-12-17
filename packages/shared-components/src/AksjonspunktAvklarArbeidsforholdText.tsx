import React, { ReactNode, FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel.svg';

import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import { FlexColumn, FlexContainer, FlexRow } from './flexGrid';
import Image from './Image';

import styles from './aksjonspunktAvklarArbeidsforholdText.less';

interface OwnProps {
  children: string[] | ReactNode[];
  isAksjonspunktOpen: boolean;
  marginBottom?: boolean;
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
                  yrkestittel: `${arbeidsforhold.yrkestittel}(${arbeidsforhold.arbeidsforhold.eksternArbeidsforholdId})`,
                }}
              />
            </Normaltekst>
          </FlexColumn>
        </FlexRow>
        <FlexRow>
          <Normaltekst className={styles.info}>
            <FormattedMessage id="HelpText.TaKontakt" />
          </Normaltekst>
        </FlexRow>
        <div className={styles.hl} />
        <FlexRow>
          <Normaltekst className={styles.helptext}>
            <FormattedMessage id="HelpText.DersomIkkeKanRapporteres" />
          </Normaltekst>
        </FlexRow>
      </FlexContainer>
    </div>
  );
};

export default injectIntl(AksjonspunktAvklarArbeidsforholdText);
