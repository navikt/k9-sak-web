import { Alert, Heading } from '@navikt/ds-react';
import { FormikProps, FormikValues } from 'formik';
import { Column, Row } from 'nav-frontend-grid';
import AlertStripe from 'nav-frontend-alertstriper';
import React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

import { VerticalSpacer, useFeatureToggles } from '@fpsak-frontend/shared-components';
import { hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { TextAreaFormik, TextFieldFormik } from '@fpsak-frontend/form';
import { kanHaManueltFritekstbrev, TilgjengeligeVedtaksbrev } from '@fpsak-frontend/utils/src/formidlingUtils';
import { DokumentDataType } from '@k9-sak-web/types/src/dokumentdata';

import InkluderKalenderCheckbox from './InkluderKalenderCheckbox';

import styles from './vedtakForm.less';
import FritekstRedigering from './FritekstRedigering/FritekstRedigering';

import { fieldnames } from '../konstanter';

const maxLength200 = maxLength(200);
const maxLength100000 = maxLength(100000);
const minLength3 = minLength(3);

interface OwnProps {
  previewBrev: (e: any) => void;
  lagreDokumentdata: (any) => void;
  hentFritekstbrevHtmlCallback: (parameters: any) => any;
  readOnly: boolean;
  harAutomatiskVedtaksbrev: boolean;
  tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev;
  kanInkludereKalender: boolean;
  intl: IntlShape;
  formikProps: FormikProps<FormikValues>;
  dokumentdata: DokumentDataType;
  setEditorHarLagret: React.Dispatch<React.SetStateAction<boolean>>;
}

const FritekstBrevPanel = ({
  previewBrev,
  lagreDokumentdata,
  hentFritekstbrevHtmlCallback,
  readOnly,
  harAutomatiskVedtaksbrev,
  tilgjengeligeVedtaksbrev,
  kanInkludereKalender,
  intl,
  formikProps,
  dokumentdata,
  setEditorHarLagret,
}: OwnProps) => {
  const { formatMessage } = intl;
  const [featureToggles] = useFeatureToggles();
  const kanRedigereFritekstbrev = kanHaManueltFritekstbrev(tilgjengeligeVedtaksbrev);

  const handleFritekstSubmit = async (html: string, request) => {
    formikProps.setFieldValue(fieldnames.REDIGERT_HTML, html);
    await lagreDokumentdata(request);
    setEditorHarLagret(true);
  };

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
        <div className={styles.brevAlertContainer} data-testid="harAutomatiskVedtaksbrev">
          <Alert variant="info" size="small">
            <Row>
              <Column xs="12">
                <FormattedMessage id="VedtakForm.AutomatiskBrev" />
              </Column>
            </Row>
          </Alert>
        </div>
      )}
      {!readOnly && !harAutomatiskVedtaksbrev && (
        <div className={styles.brevAlertContainer} data-testid="harIkkeAutomatiskVedtaksbrev">
          <Alert variant="info" size="small">
            Denne type behandling er det ikke utviklet automatisk brev for enda.
          </Alert>
        </div>
      )}

      {!featureToggles.FRITEKST_REDIGERING ||
        (!kanRedigereFritekstbrev && (
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
          </div>
        ))}

      {kanRedigereFritekstbrev && formikProps.values.skalBrukeOverstyrendeFritekstBrev && (
        <div className={readOnly ? 'readOnly' : styles.brevFormContainer}>
          <FritekstRedigering
            handleSubmit={handleFritekstSubmit}
            hentFritekstbrevHtmlCallback={hentFritekstbrevHtmlCallback}
            setFieldValue={formikProps.setFieldValue}
            previewBrev={previewBrev}
            readOnly={readOnly}
            tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
            dokumentdata={dokumentdata}
            innholdTilRedigering={formikProps.values[fieldnames.REDIGERT_HTML]}
            inkluderKalender={formikProps.values[fieldnames.INKLUDER_KALENDER_VED_OVERSTYRING]}
          />

          {kanInkludereKalender && (
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
      )}
    </div>
  );
};

FritekstBrevPanel.defaultProps = {};

export default injectIntl(FritekstBrevPanel);
