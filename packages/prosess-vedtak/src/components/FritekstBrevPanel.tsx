import { Alert, Heading } from '@navikt/ds-react';
import { FormikProps, FormikValues } from 'formik';
import React from 'react';
import { FormattedMessage, IntlShape, injectIntl } from 'react-intl';

import { TextAreaFormik, TextFieldFormik } from '@k9-sak-web/form';
import { VerticalSpacer, useFeatureToggles } from '@k9-sak-web/shared-components';
import { DokumentDataType } from '@k9-sak-web/types/src/dokumentdata';
import { hasValidText, maxLength, minLength, required } from '@k9-sak-web/utils';
import {
  Brevmottaker,
  TilgjengeligeVedtaksbrev,
  kanHaManueltFritekstbrev,
} from '@k9-sak-web/utils/src/formidlingUtils';

import InkluderKalenderCheckbox from './InkluderKalenderCheckbox';

import FritekstRedigering from './FritekstRedigering/FritekstRedigering';
import styles from './vedtakForm.module.css';

import { fieldnames } from '../konstanter';

const maxLength200 = maxLength(200);
const maxLength100000 = maxLength(100000);
const minLength3 = minLength(3);

interface OwnProps {
  previewBrev: (event: React.SyntheticEvent, html?: string) => void;
  lagreDokumentdata: (any) => void;
  hentFritekstbrevHtmlCallback: (parameters: any) => any;
  readOnly: boolean;
  harAutomatiskVedtaksbrev: boolean;
  tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev;
  kanInkludereKalender: boolean;
  intl: IntlShape;
  formikProps: FormikProps<FormikValues>;
  dokumentdata: DokumentDataType;
  dokumentdataInformasjonsbehov: any;
  overstyrtMottaker?: Brevmottaker;
  setForhaandsvisningKlart: React.Dispatch<React.SetStateAction<boolean>>;
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
  dokumentdataInformasjonsbehov,
  overstyrtMottaker,
  setForhaandsvisningKlart,
}: OwnProps) => {
  const { formatMessage } = intl;
  const [featureToggles] = useFeatureToggles();
  const kanRedigereFritekstbrev = kanHaManueltFritekstbrev(tilgjengeligeVedtaksbrev);

  const handleFritekstSubmit = async (html: string, request) => {
    formikProps.setFieldValue(fieldnames.REDIGERT_HTML, html);
    await lagreDokumentdata(request);
  };

  return (
    <div className={styles.fritekstbrevPanel}>
      {!harAutomatiskVedtaksbrev && <VerticalSpacer sixteenPx />}
      <Heading className={styles.brevHeading} size="small" level="2">
        <FormattedMessage id="VedtakForm.Brev" />
      </Heading>
      {!readOnly && harAutomatiskVedtaksbrev && (
        <div className={styles.brevAlertContainer} data-testid="harAutomatiskVedtaksbrev">
          <Alert variant="info" size="small">
            <FormattedMessage id="VedtakForm.AutomatiskBrev" />
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
            <TextFieldFormik
              name="overskrift"
              label={formatMessage({ id: 'VedtakForm.Overskrift' })}
              validate={[required, minLength3, maxLength200, hasValidText]}
              maxLength={200}
              readOnly={readOnly}
            />
            <div className={readOnly ? styles['textAreaContainer--readOnly'] : styles.textAreaContainer}>
              <TextAreaFormik
                name="brødtekst"
                label={formatMessage({ id: 'VedtakForm.Innhold' })}
                validate={[required, minLength3, maxLength100000, hasValidText]}
                maxLength={100000}
                readOnly={readOnly}
              />
            </div>
          </div>
        ))}

      {kanRedigereFritekstbrev && formikProps.values.skalBrukeOverstyrendeFritekstBrev && (
        <div className={readOnly ? 'readOnly' : styles.manueltBrevFormContainer}>
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
            skalBrukeOverstyrendeFritekstBrev={formikProps.values.skalBrukeOverstyrendeFritekstBrev}
            kanInkludereKalender={kanInkludereKalender}
            dokumentdataInformasjonsbehov={dokumentdataInformasjonsbehov}
            overstyrtMottaker={overstyrtMottaker}
            setForhaandsvisningKlart={setForhaandsvisningKlart}
          />

          {formikProps.touched?.[fieldnames.REDIGERT_HTML] && formikProps.errors?.[fieldnames.REDIGERT_HTML] && (
            <>
              <VerticalSpacer sixteenPx />
              <Alert size="small" variant="error">
                {formikProps.errors[fieldnames.REDIGERT_HTML] as string}
              </Alert>
            </>
          )}

          {kanInkludereKalender && !kanRedigereFritekstbrev && (
            <div className={readOnly ? styles['textAreaContainer--readOnly'] : styles.textAreaContainer}>
              <InkluderKalenderCheckbox
                intl={intl}
                setFieldValue={formikProps.setFieldValue}
                skalBrukeOverstyrendeFritekstBrev={formikProps.values.skalBrukeOverstyrendeFritekstBrev}
                disabled={readOnly}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

FritekstBrevPanel.defaultProps = {};

export default injectIntl(FritekstBrevPanel);
