import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Undertekst } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  decodeHtmlEntity,
  getLanguageFromSprakkode,
  hasValidText,
  maxLength,
  minLength,
  requiredIfNotPristine,
} from '@fpsak-frontend/utils';
import TextAreaFormik from '../../../form/src/TextAreaFormik';

import styles from './vedtakAvslagPanel.less';

const maxLength100000 = maxLength(100000);
const minLength3 = minLength(3);

const VedtakFritekstPanelImpl = ({ begrunnelse, begrunnelseFieldName, sprakkode, readOnly, label, intl }) => (
  <>
    {!readOnly && (
      <Row>
        {console.log(sprakkode)}
        <VerticalSpacer sixteenPx />
        <Column xs="12">
          <TextAreaFormik
            name={begrunnelseFieldName}
            label={label}
            validate={[requiredIfNotPristine, minLength3, maxLength100000, hasValidText]}
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
        <Undertekst>{intl.formatMessage({ id: labelTextCode })}</Undertekst>
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
