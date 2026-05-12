import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { TextAreaField } from '@fpsak-frontend/form';
import { hasValidText, required } from '@fpsak-frontend/utils';

import styles from './fritekstAnkeBrevTextField.module.css';

const FritekstAnkeBrevTextField = ({ readOnly = false }) => {
  const intl = useIntl();
  return (
    <div className={styles.fritekstTilBrevTextArea}>
      <TextAreaField
        name="fritekstTilBrev"
        label={intl.formatMessage({ id: 'FritekstAnkeBrevTextField' })}
        validate={[required, hasValidText]}
        readOnly={readOnly}
        maxLength={100000}
      />
    </div>
  );
};

FritekstAnkeBrevTextField.propTypes = {
  readOnly: PropTypes.bool,
};

export default FritekstAnkeBrevTextField;
