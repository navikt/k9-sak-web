import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { decodeHtmlEntity, getLanguageFromSprakkode, hasValidText, maxLength, minLength } from '@fpsak-frontend/utils';
import TextAreaFormik from '@fpsak-frontend/form/src/TextAreaFormik';

import styles from './vedtakFritekstPanel.less';

const maxLength100000 = maxLength(100000);
const minLength3 = minLength(3);

const VedtakFritekstPanelImpl = ({ begrunnelse, begrunnelseFieldName, sprakkode, readOnly, label, intl }) => (
  <>
    {!readOnly && (
      <Row>
        <VerticalSpacer sixteenPx />
        <Column xs="12">
          <TextAreaFormik
            name={begrunnelseFieldName}
            label={label}
            validate={[minLength3, maxLength100000, hasValidText]}
            maxLength={100000}
            readOnly={readOnly}
            badges={[
              {
                type: 'fokus',
                text: getLanguageFromSprakkode(sprakkode),
                title: intl.formatMessage({ id: 'Malform.Beskrivelse' }),
              },
            ]}
          />
        </Column>
      </Row>
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
  sprakkode: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  intl: PropTypes.shape(),
};
export default VedtakFritekstPanelImpl;
