import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import {
  behandlingForm,
  behandlingFormValueSelector,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/form';
import { FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegSubmitButton } from '@k9-sak-web/prosess-felles';
import ankeVurdering from '@fpsak-frontend/kodeverk/src/ankeVurdering';
import ankeVurderingOmgjoer from '@fpsak-frontend/kodeverk/src/ankeVurderingOmgjoer';

import PreviewAnkeLink from './PreviewAnkeLink';

const isVedtakUtenToTrinn = apCodes => apCodes.includes(aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL); // 5018
const isMedUnderskriver = apCodes => apCodes.includes(aksjonspunktCodes.FORESLA_VEDTAK); // 5015
const isFatterVedtak = apCodes => apCodes.includes(aksjonspunktCodes.FATTER_VEDTAK); // 5016

const ResultatEnkel = ({ ankevurderingresultat: { begrunnelse } }) => (
  <div>
    <Undertekst>
      <FormattedMessage id="Ankebehandling.Resultat.Innstilling.Stadfest" />
    </Undertekst>
    <VerticalSpacer sixteenPx />
    <Undertekst>
      <FormattedMessage id="Ankebehandling.Resultat.Innstilling.Begrunnelse" />
    </Undertekst>
    <Undertekst>{begrunnelse}</Undertekst>
  </div>
);

ResultatEnkel.propTypes = {
  ankevurderingresultat: PropTypes.shape(),
};

const ResultatOpphev = ({ ankevurderingresultat: { begrunnelse } }) => (
  <div>
    <Undertekst>
      <FormattedMessage id="Ankebehandling.Resultat.Innstilling.Oppheves" />
    </Undertekst>
    <VerticalSpacer sixteenPx />
    <Undertekst>
      <FormattedMessage id="Ankebehandling.Resultat.Innstilling.Begrunnelse" />
    </Undertekst>
    <Undertekst>{begrunnelse}</Undertekst>
  </div>
);

ResultatOpphev.propTypes = {
  ankevurderingresultat: PropTypes.shape(),
};

const ResultatAvvise = ({
  ankevurderingresultat: {
    paAnketBehandlingId,
    erAnkerIkkePart,
    erIkkeKonkret,
    erFristIkkeOverholdt,
    erIkkeSignert,
    erSubsidiartRealitetsbehandles,
    begrunnelse,
  },
}) => (
  <>
    <Undertekst>
      {paAnketBehandlingId != null && <FormattedMessage id="Ankebehandling.Resultat.Innstilling.Avvises" />}
      {paAnketBehandlingId == null && <FormattedMessage id="Ankebehandling.Resultat.Innstilling.AvvisesUten" />}
    </Undertekst>
    <VerticalSpacer sixteenPx />
    <Undertekst>
      <FormattedMessage id="Ankebehandling.Resultat.Innstilling.Arsak" />
    </Undertekst>
    <ul>
      {erAnkerIkkePart && (
        <li>
          <FormattedMessage id="Ankebehandling.Avvisning.IkkePart" />
        </li>
      )}
      {erIkkeKonkret && (
        <li>
          <FormattedMessage id="Ankebehandling.Avvisning.IkkeKonkret" />
        </li>
      )}
      {erFristIkkeOverholdt && (
        <li>
          <FormattedMessage id="Ankebehandling.Avvisning.IkkeFrist" />
        </li>
      )}
      {erIkkeSignert && (
        <li>
          <FormattedMessage id="Ankebehandling.Avvisning.IkkeSignert" />
        </li>
      )}
    </ul>
    <Undertekst>
      <FormattedMessage id="Ankebehandling.Realitetsbehandles" />
      <FormattedMessage
        id={
          erSubsidiartRealitetsbehandles
            ? 'Ankebehandling.Realitetsbehandles.Ja'
            : 'Ankebehandling.Realitetsbehandles.Nei'
        }
      />
    </Undertekst>
    <VerticalSpacer sixteenPx />
    <Undertekst>
      <FormattedMessage id="Ankebehandling.Resultat.Innstilling.Begrunnelse" />
    </Undertekst>
    <Undertekst>{begrunnelse}</Undertekst>
  </>
);

ResultatAvvise.propTypes = {
  ankevurderingresultat: PropTypes.shape(),
};

const hentSprakKode = ankeOmgjoerArsak => {
  switch (ankeOmgjoerArsak) {
    case ankeVurderingOmgjoer.ANKE_TIL_UGUNST:
      return 'Ankebehandling.Resultat.Innstilling.Omgjores.TilUgunst';
    case ankeVurderingOmgjoer.ANKE_TIL_GUNST:
      return 'Ankebehandling.Resultat.Innstilling.Omgjores.TilGunst';
    case ankeVurderingOmgjoer.ANKE_DELVIS_OMGJOERING_TIL_GUNST:
      return 'Ankebehandling.Resultat.Innstilling.Omgjores.Delvis';
    default:
      return '';
  }
};

const ResultatOmgjores = ({
  ankevurderingresultat: { ankeVurderingOmgjoer: omgjoer, ankeOmgjoerArsakNavn, begrunnelse },
}) => (
  <>
    <Undertekst>
      <FormattedMessage id={hentSprakKode(omgjoer)} />
    </Undertekst>
    <VerticalSpacer sixteenPx />
    <Undertekst>
      <FormattedMessage id="Ankebehandling.Resultat.Innstilling.Arsak" />
    </Undertekst>
    <Undertekst>{ankeOmgjoerArsakNavn}</Undertekst>
    <VerticalSpacer sixteenPx />
    <Undertekst>
      <FormattedMessage id="Ankebehandling.Resultat.Innstilling.Begrunnelse" />
    </Undertekst>
    <Undertekst>{begrunnelse}</Undertekst>
  </>
);

ResultatOmgjores.propTypes = {
  ankevurderingresultat: PropTypes.shape(),
};

const AnkeResultat = ({ ankevurderingresultat } = {}) => {
  if (!ankevurderingresultat) {
    return null;
  }
  const { ankeVurdering: vurdering } = ankevurderingresultat;
  switch (vurdering) {
    case ankeVurdering.ANKE_STADFESTE_YTELSESVEDTAK:
      return <ResultatEnkel ankevurderingresultat={ankevurderingresultat} />;
    case ankeVurdering.ANKE_OPPHEVE_OG_HJEMSENDE:
      return <ResultatOpphev ankevurderingresultat={ankevurderingresultat} />;
    case ankeVurdering.ANKE_OMGJOER:
      return <ResultatOmgjores ankevurderingresultat={ankevurderingresultat} />;
    case ankeVurdering.ANKE_AVVIS:
      return <ResultatAvvise ankevurderingresultat={ankevurderingresultat} />;
    default:
      return <div>???</div>;
  }
};

AnkeResultat.propTypes = {
  ankevurderingresultat: PropTypes.shape(),
};

const AnkeResultatForm = ({
  intl,
  handleSubmit,
  previewCallback,
  aksjonspunktCode,
  formValues,
  ankeVurderingResultat,
  readOnly,
  behandlingId,
  behandlingVersjon,
  ...formProps
}) => (
  <form onSubmit={handleSubmit}>
    <FadingPanel>
      <Undertittel>
        <FormattedMessage id="Ankebehandling.Resultat.Title" />
      </Undertittel>
      <VerticalSpacer fourPx />
      <Row>
        <Column xs="12">
          <Undertekst>
            <FormattedMessage id="Ankebehandling.Resultat.Innstilling" />
          </Undertekst>
          <AnkeResultat ankevurderingresultat={ankeVurderingResultat} />
        </Column>
      </Row>
      <VerticalSpacer sixteenPx />
      <Row>
        <Column xs="12">
          <ProsessStegSubmitButton
            formName={formProps.form}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            isReadOnly={readOnly}
            isSubmittable={!readOnly && isMedUnderskriver(aksjonspunktCode) && !isFatterVedtak(aksjonspunktCode)}
            hasEmptyRequiredFields={false}
            isBehandlingFormSubmitting={isBehandlingFormSubmitting}
            isBehandlingFormDirty={isBehandlingFormDirty}
            hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
            text={intl.formatMessage({ id: 'Ankebehandling.Resultat.SendTilMedunderskriver' })}
          />
          <span>&nbsp;</span>
          <ProsessStegSubmitButton
            formName={formProps.form}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            isReadOnly={readOnly}
            isSubmittable={!readOnly && isVedtakUtenToTrinn(aksjonspunktCode) && !isFatterVedtak(aksjonspunktCode)}
            hasEmptyRequiredFields={false}
            isBehandlingFormSubmitting={isBehandlingFormSubmitting}
            isBehandlingFormDirty={isBehandlingFormDirty}
            hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
            text={intl.formatMessage({ id: 'Ankebehandling.Resultat.FerdigstillAnke' })}
          />
          <span>&nbsp;</span>
          <PreviewAnkeLink
            previewCallback={previewCallback}
            fritekstTilBrev={formValues.fritekstTilBrev}
            ankeVurdering={formValues.ankeVurdering}
            aksjonspunktCode={aksjonspunktCode}
          />
        </Column>
      </Row>
    </FadingPanel>
  </form>
);

AnkeResultatForm.propTypes = {
  intl: PropTypes.shape().isRequired,
  previewCallback: PropTypes.func.isRequired,
  saveAnke: PropTypes.func.isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  formValues: PropTypes.shape(),
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  ankevurderingresultat: PropTypes.shape(),
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  ...formPropTypes,
};

AnkeResultatForm.defaultProps = {
  formValues: {},
  readOnly: true,
  readOnlySubmitButton: true,
  ankevurderingresultat: {},
};

// TODO (TOR) Her ligg det masse som ikkje er felt i forma! Rydd
const transformValues = (values, aksjonspunktCode) => ({
  vedtak: values.vedtak === '0' ? null : values.vedtak,
  ankeVurdering: values.ankeVurdering,
  begrunnelse: values.begrunnelse,
  erMerknaderMottatt: values.erMerknaderMottatt,
  merknadKommentar: values.merknadKommentar,
  fritekstTilBrev: values.fritekstTilBrev,
  vedtaksdatoAnketBehandling: values.vedtaksdatoAnketBehandling,
  erGodkjentAvMedunderskriver: values.erGodkjentAvMedunderskriver,
  erAnkerIkkePart: values.erAnkerIkkePart,
  erIkkeKonkret: values.erIkkeKonkret,
  erFristIkkeOverholdt: values.erFristIkkeOverholdt,
  erIkkeSignert: values.erIkkeSignert,
  erSubsidiartRealitetsbehandles: values.erSubsidiartRealitetsbehandles,
  ankeAvvistArsak: values.ankeAvvistArsak,
  ankeOmgjoerArsak: values.ankeOmgjoerArsak,
  ankeVurderingOmgjoer: values.ankeVurderingOmgjoer,
  gjelderVedtak: values.vedtak !== '0',
  kode: aksjonspunktCode,
});

const IKKE_PAA_ANKET_BEHANDLING_ID = '0';
const formatId = b => (b === null ? IKKE_PAA_ANKET_BEHANDLING_ID : `${b}`);
// TODO (TOR) Rydd i dette! Treng neppe senda med alt dette til backend
const buildInitialValues = createSelector([ownProps => ownProps.ankeVurderingResultat], resultat => ({
  vedtak: resultat ? formatId(resultat.paAnketBehandlingId) : null,
  ankeVurdering: resultat ? resultat.ankeVurdering : null,
  begrunnelse: resultat ? resultat.begrunnelse : null,
  fritekstTilBrev: resultat ? resultat.fritekstTilBrev : null,
  vedtaksdatoAnketBehandling: resultat ? resultat.vedtaksdatoAnketBehandling : null,
  erGodkjentAvMedunderskriver: resultat ? resultat.erGodkjentAvMedunderskriver : false,
  erAnkerIkkePart: resultat ? resultat.erAnkerIkkePart : false,
  erIkkeKonkret: resultat ? resultat.erIkkeKonkret : false,
  erFristIkkeOverholdt: resultat ? resultat.erFristIkkeOverholdt : false,
  erIkkeSignert: resultat ? resultat.erIkkeSignert : false,
  erSubsidiartRealitetsbehandles: resultat ? resultat.erSubsidiartRealitetsbehandles : null,
  ankeAvvistArsak: resultat ? resultat.ankeAvvistArsak : null,
  ankeOmgjoerArsak: resultat ? resultat.ankeOmgjoerArsak : null,
  ankeVurderingOmgjoer: resultat ? resultat.ankeVurderingOmgjoer : null,
  gjelderVedtak: resultat ? resultat.gjelderVedtak : null,
}));

const formName = 'ankeResultatForm';

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const aksjonspunktCode = initialOwnProps.aksjonspunkter[0].definisjon;
  const onSubmit = values => initialOwnProps.submitCallback([transformValues(values, aksjonspunktCode)]);
  return (state, ownProps) => ({
    aksjonspunktCode,
    initialValues: buildInitialValues(ownProps),
    formValues: behandlingFormValueSelector(formName, ownProps.behandlingId, ownProps.behandlingVersjon)(
      state,
      'ankeVurdering',
      'fritekstTilBrev',
      'gjelderVedtak',
    ),
    onSubmit,
  });
};

const BehandleResultatForm = connect(mapStateToPropsFactory)(
  behandlingForm({
    form: formName,
  })(injectIntl(AnkeResultatForm)),
);

export default BehandleResultatForm;
