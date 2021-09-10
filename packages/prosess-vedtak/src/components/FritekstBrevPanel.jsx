import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Undertittel } from 'nav-frontend-typografi';

import { TextAreaField } from '@fpsak-frontend/form';
import { getLanguageCodeFromSprakkode, hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';

import styles from './vedtakForm.less';
import PreviewLink from './PreviewLink';

const maxLength200 = maxLength(200);
const minLength3 = minLength(3);

const FritekstBrevPanelImpl = ({ previewBrev, readOnly, sprakkode, harAutomatiskVedtaksbrev }) => (
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
        <TextAreaField
          name="overskrift"
          label={{ id: 'VedtakForm.Overskrift' }}
          validate={[required, minLength3, maxLength200, hasValidText]}
          maxLength={200}
          rows={1}
          readOnly={readOnly}
          className={styles.smallTextArea}
          badges={[
            {
              type: 'fokus',
              textId: getLanguageCodeFromSprakkode(sprakkode),
              title: 'Malform.Beskrivelse',
            },
          ]}
        />
      </Column>
    </Row>
    <Row>
      <Column xs="12">
        <TextAreaField
          name="brødtekst"
          label={{ id: 'VedtakForm.Innhold' }}
          validate={[required, minLength3, hasValidText]}
          readOnly={readOnly}
        />
      </Column>
    </Row>
  </>
);

FritekstBrevPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  previewBrev: PropTypes.func.isRequired,
  sprakkode: PropTypes.shape().isRequired,
  harAutomatiskVedtaksbrev: PropTypes.bool.isRequired,
};

FritekstBrevPanelImpl.defaultProps = {};

const FritekstBrevPanel = injectIntl(FritekstBrevPanelImpl);
export default FritekstBrevPanel;
