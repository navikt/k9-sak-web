import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

import { TextAreaField } from '@fpsak-frontend/form';
import { getLanguageCodeFromSprakkode, hasValidText, required } from '@fpsak-frontend/utils';

import styles from './fritekstTextField.css';

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
          type: 'fokus',
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
