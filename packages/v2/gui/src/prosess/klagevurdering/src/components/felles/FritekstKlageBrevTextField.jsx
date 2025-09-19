import PropTypes from 'prop-types';

import { TextAreaField } from '@fpsak-frontend/form';
import { getLanguageCodeFromspråkkode, hasValidText, required } from '@fpsak-frontend/utils';

import styles from './fritekstKlageBrevTextField.module.css';

const FritekstKlageBrevTextField = ({ språkkode, readOnly = true, intl }) => (
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
          textId: getLanguageCodeFromspråkkode(språkkode),
          title: 'Malform.Beskrivelse',
        },
      ]}
    />
  </div>
);

FritekstKlageBrevTextField.propTypes = {
  språkkode: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool,
};
