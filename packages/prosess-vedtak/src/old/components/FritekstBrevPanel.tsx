import React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Heading } from '@navikt/ds-react';
import { FormikProps, FormikValues } from 'formik';

import { hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import TextAreaFormik from '@fpsak-frontend/form/src/TextAreaFormik';
import InkluderKalenderCheckbox from './InkluderKalenderCheckbox';

import styles from './vedtakForm.less';
import PreviewLink from './PreviewLink';

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
      {!harAutomatiskVedtaksbrev && <VerticalSpacer sixteenPx />}
      <Row>
        <Column xs="12">
          <Heading size="small" level="2">
            <FormattedMessage id="VedtakForm.Brev" />
          </Heading>
        </Column>
      </Row>
      <Row>
        <Column xs="12">
          <TextAreaFormik
            name="overskrift"
            label={formatMessage({ id: 'VedtakForm.Overskrift' })}
            validate={[required, minLength3, maxLength200, hasValidText]}
            maxLength={200}
            readOnly={readOnly}
          />
        </Column>
      </Row>
      <VerticalSpacer sixteenPx />
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
      {ytelseTypeKode === 'PSB' && (
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
      )}
    </>
  );
};

FritekstBrevPanel.defaultProps = {};

export default injectIntl(FritekstBrevPanel);
