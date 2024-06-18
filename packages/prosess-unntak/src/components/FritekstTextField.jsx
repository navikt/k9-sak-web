import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

import { TextAreaField } from '@fpsak-frontend/form';
import { getLanguageCodeFromSprakkode, hasValidText, required } from '@fpsak-frontend/utils';

import styles from './fritekstTextField.module.css';

const FritekstTextField = ({ sprakkode, readOnly = true, intl }) => (
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

export default injectIntl(FritekstTextField);
