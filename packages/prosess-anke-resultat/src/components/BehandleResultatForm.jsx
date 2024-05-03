import {
  behandlingForm,
  behandlingFormValueSelector,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@k9-sak-web/form';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import ankeVurdering from '@k9-sak-web/kodeverk/src/ankeVurdering';
import ankeVurderingOmgjoer from '@k9-sak-web/kodeverk/src/ankeVurderingOmgjoer';
import { ProsessStegSubmitButton } from '@k9-sak-web/prosess-felles';
import { FadingPanel, VerticalSpacer } from '@k9-sak-web/shared-components';
import { Detail, Heading } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';

import PreviewAnkeLink from './PreviewAnkeLink';

const isVedtakUtenToTrinn = apCodes => apCodes.includes(aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL); // 5018
const isMedUnderskriver = apCodes => apCodes.includes(aksjonspunktCodes.FORESLA_VEDTAK); // 5015
const isFatterVedtak = apCodes => apCodes.includes(aksjonspunktCodes.FATTER_VEDTAK); // 5016

const ResultatEnkel = ({ ankevurderingresultat: { begrunnelse } }) => (
  <div>
    <Detail>
      <FormattedMessage id="Ankebehandling.Resultat.Innstilling.Stadfest" />
    </Detail>
    <VerticalSpacer sixteenPx />
    <Detail>
      <FormattedMessage id="Ankebehandling.Resultat.Innstilling.Begrunnelse" />
    </Detail>
    <Detail>{begrunnelse}</Detail>
  </div>
);

ResultatEnkel.propTypes = {
  ankevurderingresultat: PropTypes.shape(),
};

const ResultatOpphev = ({ ankevurderingresultat: { begrunnelse } }) => (
  <div>
    <Detail>
      <FormattedMessage id="Ankebehandling.Resultat.Innstilling.Oppheves" />
    </Detail>
    <VerticalSpacer sixteenPx />
    <Detail>
      <FormattedMessage id="Ankebehandling.Resultat.Innstilling.Begrunnelse" />
    </Detail>
    <Detail>{begrunnelse}</Detail>
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
    <Detail>
      {paAnketBehandlingId != null && <FormattedMessage id="Ankebehandling.Resultat.Innstilling.Avvises" />}
      {paAnketBehandlingId == null && <FormattedMessage id="Ankebehandling.Resultat.Innstilling.AvvisesUten" />}
    </Detail>
    <VerticalSpacer sixteenPx />
    <Detail>
      <FormattedMessage id="Ankebehandling.Resultat.Innstilling.Arsak" />
    </Detail>
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
    <Detail>
      <FormattedMessage id="Ankebehandling.Realitetsbehandles" />
      <FormattedMessage
        id={
          erSubsidiartRealitetsbehandles
            ? 'Ankebehandling.Realitetsbehandles.Ja'
            : 'Ankebehandling.Realitetsbehandles.Nei'
        }
      />
    </Detail>
    <VerticalSpacer sixteenPx />
    <Detail>
      <FormattedMessage id="Ankebehandling.Resultat.Innstilling.Begrunnelse" />
    </Detail>
    <Detail>{begrunnelse}</Detail>
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
    <Detail>
      <FormattedMessage id={hentSprakKode(omgjoer)} />
    </Detail>
    <VerticalSpacer sixteenPx />
    <Detail>
      <FormattedMessage id="Ankebehandling.Resultat.Innstilling.Arsak" />
    </Detail>
    <Detail>{ankeOmgjoerArsakNavn}</Detail>
    <VerticalSpacer sixteenPx />
    <Detail>
      <FormattedMessage id="Ankebehandling.Resultat.Innstilling.Begrunnelse" />
    </Detail>
    <Detail>{begrunnelse}</Detail>
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
      <Heading size="small" level="2">
        <FormattedMessage id="Ankebehandling.Resultat.Title" />
      </Heading>
      <VerticalSpacer fourPx />
      <Detail>
        <FormattedMessage id="Ankebehandling.Resultat.Innstilling" />
      </Detail>
      <AnkeResultat ankevurderingresultat={ankeVurderingResultat} />
      <VerticalSpacer sixteenPx />
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
  const aksjonspunktCode = initialOwnProps.aksjonspunkter[0].definisjon.kode;
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
