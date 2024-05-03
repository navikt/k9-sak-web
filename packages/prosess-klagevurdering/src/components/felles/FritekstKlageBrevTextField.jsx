import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

import { TextAreaField } from '@k9-sak-web/form';
import { getLanguageCodeFromSprakkode, hasValidText, required } from '@k9-sak-web/utils';

import styles from './fritekstKlageBrevTextField.module.css';

const FritekstKlageBrevTextField = ({ sprakkode, readOnly, intl }) => (
  <div className={styles.fritekstTilBrevTextArea}>
    <TextAreaField
      name="fritekstTilBrev"
      label={intl.formatMessage({ id: 'FritekstKlageBrevTextField.Fritekst' })}
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

FritekstKlageBrevTextField.propTypes = {
  sprakkode: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool,
};

FritekstKlageBrevTextField.defaultProps = {
  readOnly: true,
};

export default injectIntl(FritekstKlageBrevTextField);
