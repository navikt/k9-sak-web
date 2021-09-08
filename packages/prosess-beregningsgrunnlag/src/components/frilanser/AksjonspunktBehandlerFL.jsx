import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { InputField } from '@fpsak-frontend/form';
import { formatCurrencyNoKr, parseCurrencyInput, required } from '@fpsak-frontend/utils';

import styles from '../fellesPaneler/aksjonspunktBehandler.less';

const AksjonspunktBehandlerFL = ({ readOnly, fieldArrayID }) => (
  <Row className={styles.verticalAlignMiddle}>
    <Column xs="7">
      <Normaltekst>
        <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandlerFL" />
      </Normaltekst>
    </Column>
    <Column xs="5">
      <div id="readOnlyWrapper" className={readOnly ? styles.inputPadding : undefined}>
        <InputField
          name={`${fieldArrayID}.inntektFrilanser`}
          validate={[required]}
          readOnly={readOnly}
          parse={parseCurrencyInput}
          bredde="S"
        />
      </div>
    </Column>
  </Row>
);
AksjonspunktBehandlerFL.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  fieldArrayID: PropTypes.string.isRequired,
};

AksjonspunktBehandlerFL.buildInitialValues = relevanteAndeler => {
  if (relevanteAndeler.length === 0) {
    return undefined;
  }
  return {
    inntektFrilanser:
      relevanteAndeler[0].overstyrtPrAar !== undefined ? formatCurrencyNoKr(relevanteAndeler[0].overstyrtPrAar) : '',
  };
};

export default AksjonspunktBehandlerFL;
