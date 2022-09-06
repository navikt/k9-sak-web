import { Alert, Heading } from '@navikt/ds-react';
import { FormikProps, FormikValues } from 'formik';
import { Column, Row } from 'nav-frontend-grid';
import React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { TextAreaFormik, TextFieldFormik } from '@fpsak-frontend/form';
import InkluderKalenderCheckbox from './InkluderKalenderCheckbox';

import PreviewLink from './PreviewLink';
import styles from './vedtakForm.less';

const maxLength200 = maxLength(200);
const maxLength100000 = maxLength(100000);
const minLength3 = minLength(3);

interface OwnProps {
  previewBrev: () => void;
  readOnly: boolean;
  harAutomatiskVedtaksbrev: boolean;
  intl: IntlShape;
  formikProps: FormikProps<FormikValues>;
  ytelseTypeKode: string;
}

const FritekstBrevPanel = ({
  previewBrev,
  readOnly,
  harAutomatiskVedtaksbrev,
  intl,
  formikProps,
  ytelseTypeKode,
}: OwnProps) => {
  const { formatMessage } = intl;

  return (
    <div className={styles.fritekstbrevPanel}>
      {!harAutomatiskVedtaksbrev && <VerticalSpacer sixteenPx />}
      <Row>
        <Column xs="12">
          <Heading className={styles.brevHeading} size="small" level="2">
            <FormattedMessage id="VedtakForm.Brev" />
          </Heading>
        </Column>
      </Row>
      {!readOnly && harAutomatiskVedtaksbrev && (
        <div className={styles.brevAlertContainer}>
          <Alert variant="info" size="small">
            <Row>
              <Column xs="12">
                <FormattedMessage id="VedtakForm.AutomatiskBrev" />
              </Column>
            </Row>
            <Row>
              <Column xs="6">
                <PreviewLink previewCallback={previewBrev} noIcon>
                  <FormattedMessage id="VedtakForm.AutomatiskBrev.Lenke" />
                </PreviewLink>
              </Column>
            </Row>
          </Alert>
        </div>
      )}
      {!readOnly && !harAutomatiskVedtaksbrev && (
        <div className={styles.brevAlertContainer}>
          <Alert variant="info" size="small">
            Denne type behandling er det ikke utviklet automatisk brev for enda.
          </Alert>
        </div>
      )}
      <div className={readOnly ? '' : styles.brevFormContainer}>
        <Row>
          <Column xs="12">
            <TextFieldFormik
              name="overskrift"
              label={formatMessage({ id: 'VedtakForm.Overskrift' })}
              validate={[required, minLength3, maxLength200, hasValidText]}
              maxLength={200}
              readOnly={readOnly}
            />
          </Column>
        </Row>
        <div className={readOnly ? styles['textAreaContainer--readOnly'] : styles.textAreaContainer}>
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
        </div>
        {ytelseTypeKode === 'PSB' && (
          <div className={readOnly ? styles['textAreaContainer--readOnly'] : styles.textAreaContainer}>
            <Row>
              <Column xs="12">
                <InkluderKalenderCheckbox
                  intl={intl}
                  setFieldValue={formikProps.setFieldValue}
                  skalBrukeOverstyrendeFritekstBrev={formikProps.values.skalBrukeOverstyrendeFritekstBrev}
                  disabled={readOnly}
                />
              </Column>
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};

FritekstBrevPanel.defaultProps = {};

export default injectIntl(FritekstBrevPanel);
