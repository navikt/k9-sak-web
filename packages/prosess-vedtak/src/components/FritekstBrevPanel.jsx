import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Undertittel } from 'nav-frontend-typografi';

import { hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import TextAreaFormik from '../../../form/src/TextAreaFormik';

import styles from './vedtakForm.less';
import PreviewLink from './PreviewLink';

const maxLength200 = maxLength(200);
const maxLength100000 = maxLength(100000);
const minLength3 = minLength(3);

const FritekstBrevPanel = ({ previewBrev, readOnly, harAutomatiskVedtaksbrev }) => {
  const { formatMessage } = useIntl();
  return (
    <>
      {!readOnly && harAutomatiskVedtaksbrev && (
        <div className={styles.automatiskBrev}>
          <Row>
            <Column xs="12">
              <FormattedMessage id="VedtakForm.AutomatiskBrev" />
            </Column>
          </Row>
          <Row>
            <Column xs="6">
              <PreviewLink previewCallback={previewBrev}>
                <FormattedMessage id="VedtakForm.AutomatiskBrev.Lenke" />
              </PreviewLink>
            </Column>
          </Row>
        </div>
      )}
      <Row>
        <Column xs="12">
          <Undertittel>
            <FormattedMessage id="VedtakForm.Brev" />
          </Undertittel>
        </Column>
      </Row>
      <Row>
        <Column xs="12">
          <TextAreaFormik
            name="overskrift"
            label={formatMessage({ id: 'VedtakForm.Overskrift' })}
            validate={[required, minLength3, maxLength200, hasValidText]}
            maxLength={200}
            maxRows={1}
            readOnly={readOnly}
          />
        </Column>
      </Row>
      <Row>
        <Column xs="12">
          <TextAreaFormik
            name="brødtekst"
            label={formatMessage({ id: 'VedtakForm.Innhold' })}
            validate={[required, minLength3, maxLength100000, hasValidText]}
            maxLength={100000}
            readOnly={readOnly}
          />
        </Column>
      </Row>
    </>
  );
};

FritekstBrevPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  previewBrev: PropTypes.func.isRequired,
  harAutomatiskVedtaksbrev: PropTypes.bool.isRequired,
};

FritekstBrevPanel.defaultProps = {};

export default FritekstBrevPanel;
