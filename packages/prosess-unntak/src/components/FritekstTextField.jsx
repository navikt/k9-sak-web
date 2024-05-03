import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

import { TextAreaField } from '@k9-sak-web/form';
import { getLanguageCodeFromSprakkode, hasValidText, required } from '@k9-sak-web/utils';

import styles from './fritekstTextField.module.css';

const FritekstTextField = ({ sprakkode, readOnly, intl }) => (
  <div className={styles.fritekstTextArea}>
    <TextAreaField
      name="begrunnelse"
      label={intl.formatMessage({ id: 'FritekstTextField.Fritekst' })}
      validate={[required, hasValidText]}
      readOnly={readOnly}
      textareaClass={styles.explanationTextarea}
      maxLength={100000}
      badges={[
        {
          type: 'warning',
          textId: getLanguageCodeFromSprakkode(sprakkode),
          title: 'Malform.Beskrivelse',
        },
      ]}
    />
  </div>
);

FritekstTextField.propTypes = {
  sprakkode: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool,
};

FritekstTextField.defaultProps = {
  readOnly: true,
};

export default injectIntl(FritekstTextField);
