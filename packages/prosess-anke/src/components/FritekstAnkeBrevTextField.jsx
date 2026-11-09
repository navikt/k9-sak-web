import React from 'react';
import { useIntl } from 'react-intl';

import { TextAreaField } from '@fpsak-frontend/form';
import { getLanguageCodeFromspråkkode, hasValidText, required } from '@fpsak-frontend/utils';

import styles from './fritekstAnkeBrevTextField.module.css';

const FritekstAnkeBrevTextField = ({ språkkode, readOnly = false }) => {
  const intl = useIntl();
  return (
    <div className={styles.fritekstTilBrevTextArea}>
      <TextAreaField
        name="fritekstTilBrev"
        label={intl.formatMessage({ id: 'FritekstAnkeBrevTextField' })}
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

export default FritekstAnkeBrevTextField;
