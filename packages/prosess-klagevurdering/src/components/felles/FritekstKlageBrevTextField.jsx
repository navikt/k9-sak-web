import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

import { TextAreaField } from '@fpsak-frontend/form';
import { getLanguageCodeFromSprakkode, hasValidText, required } from '@fpsak-frontend/utils';

import styles from './fritekstKlageBrevTextField.module.css';

const FritekstKlageBrevTextField = ({ sprakkode, readOnly = true, intl }) => (
  <div className={styles.fritekstTilBrevTextArea}>
    <TextAreaField
      name="fritekstTilBrev"
      label={intl.formatMessage({ id: 'FritekstKlageBrevTextField.Fritekst' })}
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

FritekstKlageBrevTextField.propTypes = {
  sprakkode: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool,
};

export default injectIntl(FritekstKlageBrevTextField);
