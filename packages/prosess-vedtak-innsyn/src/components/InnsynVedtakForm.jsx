import {
  TextAreaField,
  behandlingForm,
  behandlingFormValueSelector,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import innsynResultatType from '@fpsak-frontend/kodeverk/src/innsynResultatType';
import kommunikasjonsretning from '@fpsak-frontend/kodeverk/src/kommunikasjonsretning';
import { FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  decodeHtmlEntity,
  getLanguageCodeFromSprakkode,
  hasValidText,
  maxLength,
  minLength,
  requiredIfNotPristine,
} from '@fpsak-frontend/utils';
import { ProsessStegSubmitButton } from '@k9-sak-web/prosess-felles';
import { BodyShort, Detail, Heading } from '@navikt/ds-react';
import { Column, Row } from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';

import DocumentListVedtakInnsyn from './DocumentListVedtakInnsyn';

import styles from './innsynVedtakForm.module.css';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);

const getPreviewCallback = (formProps, begrunnelse, previewCallback) => e => {
  if (formProps.valid || formProps.pristine) {
    const data = {
      dokumentdata: begrunnelse && { fritekst: begrunnelse },
      mottaker: '',
      dokumentMal: 'INSSKR',
      gjelderVedtak: true,
    };
    previewCallback(data);
  } else {
    formProps.submit();
  }
  e.preventDefault();
};

const findResultTypeMessage = resultat => {
  if (resultat === innsynResultatType.AVVIST) {
    return 'InnsynVedtakForm.Avslatt';
  }
  if (resultat === innsynResultatType.DELVISTINNVILGET) {
    return 'InnsynVedtakForm.Delvis';
  }
  return 'InnsynVedtakForm.Innvilget';
};

/**
 * InnsynVedtakForm
 *
 * Presentasjonskomponent. Viser panelet som håndterer vedtaksforslag av innsyn.
 */
export const InnsynVedtakFormImpl = ({
  intl,
  readOnly,
  previewCallback,
  saksNr,
  documents,
  sprakkode,
  apBegrunnelse,
  begrunnelse,
  resultat,
  behandlingId,
  behandlingVersjon,
  ...formProps
}) => {
  const previewBrev = getPreviewCallback(formProps, begrunnelse, previewCallback);
  return (
    <FadingPanel>
      <form onSubmit={formProps.handleSubmit}>
        <Heading size="small" level="2">
          <FormattedMessage id={readOnly ? 'InnsynVedtakForm.Vedtak' : 'InnsynVedtakForm.ForslagVedtak'} />
        </Heading>
        <VerticalSpacer eightPx />
        <Detail>
          <FormattedMessage id="InnsynVedtakForm.Resultat" />
        </Detail>
        <BodyShort size="small">
          <FormattedMessage id={findResultTypeMessage(resultat)} />
        </BodyShort>
        <VerticalSpacer eightPx />
        <Detail>
          <FormattedMessage id="InnsynVedtakForm.Vurdering" />
        </Detail>
        <BodyShort size="small" className={styles.wordwrap}>
          {decodeHtmlEntity(apBegrunnelse)}
        </BodyShort>
        <VerticalSpacer twentyPx />
        {resultat !== innsynResultatType.INNVILGET && (
          <Row>
            <Column xs="8">
              <TextAreaField
                name="begrunnelse"
                label={intl.formatMessage({ id: 'InnsynVedtakForm.Fritekst' })}
                validate={[requiredIfNotPristine, minLength3, maxLength1500, hasValidText]}
                maxLength={1500}
                readOnly={readOnly}
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
        )}
        <VerticalSpacer twentyPx />
        {resultat !== innsynResultatType.AVVIST && (
          <DocumentListVedtakInnsyn
            saksNr={saksNr}
            documents={documents.filter(document => document.fikkInnsyn === true)}
            readOnly={readOnly}
          />
        )}
        <VerticalSpacer twentyPx />
        <Row>
          {!readOnly && (
            <Column xs="3">
              <ProsessStegSubmitButton
                textCode="SubmitButton.ConfirmInformation"
                behandlingId={behandlingId}
                behandlingVersjon={behandlingVersjon}
                formName={formProps.form}
                isReadOnly={readOnly}
                isSubmittable
                isBehandlingFormSubmitting={isBehandlingFormSubmitting}
                isBehandlingFormDirty={isBehandlingFormDirty}
                hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
              />
            </Column>
          )}
          <Column xs="4">
            <a
              onClick={previewBrev}
              onKeyDown={e => (e.keyCode === 13 ? previewBrev(e) : null)}
              className="lenke lenke--frittstaende"
              target="_blank"
              rel="noopener noreferrer"
              role="link"
              tabIndex="0"
            >
              <FormattedMessage
                id={readOnly ? 'InnsynVedtakForm.VisVedtaksbrev' : 'InnsynVedtakForm.ForhåndsvisBrev'}
              />
            </a>
          </Column>
        </Row>
      </form>
    </FadingPanel>
  );
};

InnsynVedtakFormImpl.propTypes = {
  saksNr: PropTypes.number.isRequired,
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  apBegrunnelse: PropTypes.string.isRequired,
  resultat: PropTypes.string.isRequired,
  begrunnelse: PropTypes.string,
  sprakkode: PropTypes.shape().isRequired,
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      journalpostId: PropTypes.string.isRequired,
      dokumentId: PropTypes.string.isRequired,
      tittel: PropTypes.string.isRequired,
      tidspunkt: PropTypes.string,
      kommunikasjonsretning: PropTypes.string.isRequired,
    }),
  ).isRequired,
  ...formPropTypes,
};

InnsynVedtakFormImpl.defaultProps = {
  begrunnelse: undefined,
};

const buildInitialValues = (innsynMottattDato, aksjonspunkter) => ({
  mottattDato: innsynMottattDato,
  begrunnelse: aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.FORESLA_VEDTAK).begrunnelse,
});

const transformValues = values => ({
  kode: aksjonspunktCodes.FORESLA_VEDTAK,
  ...values,
});

// Samme dokument kan ligge på flere behandlinger under samme fagsak.
const getFilteredReceivedDocuments = createSelector([ownProps => ownProps.alleDokumenter], allDocuments => {
  const filteredDocuments = allDocuments.filter(doc => doc.kommunikasjonsretning === kommunikasjonsretning.INN);
  allDocuments.forEach(
    doc => !filteredDocuments.some(fd => fd.dokumentId === doc.dokumentId) && filteredDocuments.push(doc),
  );
  return filteredDocuments;
});

const getDocumenterMedFikkInnsynVerdi = createSelector(
  [getFilteredReceivedDocuments, ownProps => ownProps.innsynDokumenter],
  (alleDokumenter, valgteDokumenter) =>
    alleDokumenter
      .filter(dokAlle => valgteDokumenter.find(dokValgte => dokValgte.dokumentId === dokAlle.dokumentId))
      .map(dokAlle => ({
        ...dokAlle,
        fikkInnsyn: valgteDokumenter.find(dokValgte => dokValgte.dokumentId === dokAlle.dokumentId).fikkInnsyn,
      })),
);

const formName = 'InnsynVedtakForm';

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => initialOwnProps.submitCallback([transformValues(values)]);
  return (state, ownProps) => ({
    documents: getDocumenterMedFikkInnsynVerdi(ownProps),
    initialValues: buildInitialValues(ownProps.innsynMottattDato, ownProps.aksjonspunkter),
    apBegrunnelse: ownProps.aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_INNSYN)
      .begrunnelse,
    begrunnelse: behandlingFormValueSelector(
      formName,
      ownProps.behandlingId,
      ownProps.behandlingVersjon,
    )(state, 'begrunnelse'),
    resultat: ownProps.innsynResultatType.kode,
    onSubmit,
  });
};

const InnsynVedtakForm = connect(mapStateToPropsFactory)(
  injectIntl(
    behandlingForm({
      form: formName,
    })(InnsynVedtakFormImpl),
  ),
);

InnsynVedtakForm.formName = formName;

export default InnsynVedtakForm;
