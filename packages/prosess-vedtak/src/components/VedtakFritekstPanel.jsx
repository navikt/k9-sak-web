import PropTypes from 'prop-types';
import React from 'react';

import TextAreaFormik from '@fpsak-frontend/form/src/TextAreaFormik';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { decodeHtmlEntity, getLanguageFromSprakkode, hasValidText, maxLength, minLength } from '@fpsak-frontend/utils';

import styles from './vedtakFritekstPanel.module.css';

const maxLength100000 = maxLength(100000);
const minLength3 = minLength(3);

const VedtakFritekstPanelImpl = ({ begrunnelse, begrunnelseFieldName, sprakkode, readOnly, label, intl }) => (
  <>
    {!readOnly && (
      <div>
        <VerticalSpacer sixteenPx />
        <TextAreaFormik
          name={begrunnelseFieldName}
          label={label}
          validate={[minLength3, maxLength100000, hasValidText]}
          maxLength={100000}
          readOnly={readOnly}
          badges={[
            {
              type: 'warning',
              text: getLanguageFromSprakkode(sprakkode),
              title: intl.formatMessage({ id: 'Malform.Beskrivelse' }),
            },
          ]}
        />
      </div>
    )}
    {readOnly && begrunnelse !== null && (
      <span>
        <VerticalSpacer twentyPx />
        <VerticalSpacer eightPx />
        <div className={styles.fritekstItem}>{decodeHtmlEntity(begrunnelse)}</div>
      </span>
    )}
  </>
);

VedtakFritekstPanelImpl.defaultProps = {
  begrunnelse: null,
  begrunnelseFieldName: 'begrunnelse',
};

VedtakFritekstPanelImpl.propTypes = {
  begrunnelse: PropTypes.string,
  begrunnelseFieldName: PropTypes.string,
  sprakkode: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  intl: PropTypes.shape(),
};
export default VedtakFritekstPanelImpl;
