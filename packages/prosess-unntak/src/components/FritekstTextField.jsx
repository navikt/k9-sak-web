import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { getLanguageCodeFromSprakkode, hasValidText, required } from '@fpsak-frontend/utils';
import { TextAreaField } from '@fpsak-frontend/form';

import styles from './fritekstTextField.less';

const FritekstTextField = ({ sprakkode, readOnly, intl }) => (
  <div className={styles.fritekstTextArea}>
    <TextAreaField
      name="fritekst"
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
