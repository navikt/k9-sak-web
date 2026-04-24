import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { TextAreaField } from '@fpsak-frontend/form';
import { getLanguageCodeFromspråkkode, hasValidText, required } from '@fpsak-frontend/utils';

import styles from './fritekstTextField.module.css';

const FritekstTextField = ({ språkkode, readOnly = true }) => {
  const intl = useIntl();
  return (
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
};

FritekstTextField.propTypes = {
  språkkode: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool,
};

export default FritekstTextField;
