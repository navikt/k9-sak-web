import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { getLanguageCodeFromSprakkode, hasValidText, required } from '@fpsak-frontend/utils';
import { TextAreaField } from '@fpsak-frontend/form';

import styles from './fritekstBrevTextField.less';

const FritekstBrevTextField = ({ sprakkode, intl }) => (
  <div className={styles.fritekstTilBrevTextArea}>
    <TextAreaField
      name="fritekstTilBrev"
      label={intl.formatMessage({ id: 'FritekstBrevTextField.Fritekst' })}
      validate={[required, hasValidText]}
      // readOnly={readOnly}
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

FritekstBrevTextField.propTypes = {
  sprakkode: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  // readOnly: PropTypes.bool,
};

FritekstBrevTextField.defaultProps = {
  // readOnly: true,
};

export default injectIntl(FritekstBrevTextField);
