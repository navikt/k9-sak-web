import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { TextAreaField } from '@fpsak-frontend/form';
import { hasValidText, required } from '@fpsak-frontend/utils';

import styles from './fritekstTextField.module.css';

const FritekstTextField = ({ readOnly = true }) => {
  const intl = useIntl();
  return (
    <div className={styles.fritekstTextArea}>
      <TextAreaField
        name="begrunnelse"
        label={intl.formatMessage({ id: 'FritekstTextField.Fritekst' })}
        validate={[required, hasValidText]}
        readOnly={readOnly}
        maxLength={100000}
      />
    </div>
  );
};

FritekstTextField.propTypes = {
  readOnly: PropTypes.bool,
};

export default FritekstTextField;
