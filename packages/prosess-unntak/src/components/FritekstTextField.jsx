import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

import { TextAreaField } from '@fpsak-frontend/form';
import { getLanguageCodeFromspråkkode, hasValidText, required } from '@fpsak-frontend/utils';

import styles from './fritekstTextField.module.css';

const FritekstTextField = ({ språkkode, readOnly = true, intl }) => (
  <div className={styles.fritekstTextArea}>
    <TextAreaField
      name="begrunnelse"
      label={intl.formatMessage({ id: 'FritekstTextField.Fritekst' })}
      validate={[required, hasValidText]}
      readOnly={readOnly}
      maxLength={100000}
      badges={[
        {
          type: 'warning',
          textId: getLanguageCodeFromspråkkode(språkkode),
          title: 'Malform.Beskrivelse',
        },
      ]}
    />
  </div>
);

FritekstTextField.propTypes = {
  språkkode: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool,
};

export default injectIntl(FritekstTextField);
