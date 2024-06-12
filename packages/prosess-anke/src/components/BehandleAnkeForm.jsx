import {
  CheckboxField,
  RadioGroupField,
  SelectField,
  TextAreaField,
  behandlingForm,
  behandlingFormValueSelector,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import ankeVurdering from '@fpsak-frontend/kodeverk/src/ankeVurdering';
import ankeVurderingOmgjoer from '@fpsak-frontend/kodeverk/src/ankeVurderingOmgjoer';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { AksjonspunktHelpText, ArrowBox, FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT, required } from '@fpsak-frontend/utils';
import { ProsessStegSubmitButton } from '@k9-sak-web/prosess-felles';
import { BodyShort, HGrid, Heading } from '@navikt/ds-react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { KodeverkType } from '@k9-sak-web/lib/types/index.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';

import ankeOmgjorArsak from '../kodeverk/ankeOmgjorArsak';
import FritekstBrevTextField from './FritekstAnkeBrevTextField';
import PreviewAnkeLink from './PreviewAnkeLink';
import TempsaveAnkeButton from './TempsaveAnkeButton';

import styles from './behandleAnkeForm.module.css';

const omgjorArsakValues = [
  { kode: ankeOmgjorArsak.PROSESSUELL_FEIL, navn: 'Ankebehandling.OmgjoeringArsak.ProsessuellFeil' },
  { kode: ankeOmgjorArsak.ULIK_VURDERING, navn: 'Ankebehandling.OmgjoeringArsak.UlikVurdering' },
  { kode: ankeOmgjorArsak.ULIK_REGELVERKSTOLKNING, navn: 'Ankebehandling.OmgjoeringArsak.UlikRegelverkstolkning' },
  { kode: ankeOmgjorArsak.NYE_OPPLYSNINGER, navn: 'Ankebehandling.OmgjoeringArsak.NyeOpplysninger' },
];

const canSubmit = formValues => {
  if (ankeVurdering.ANKE_AVVIS === formValues.ankeVurdering && !formValues.erSubsidiartRealitetsbehandles) {
    return false;
  }
  if (
    ankeVurdering.ANKE_OMGJOER === formValues.ankeVurdering &&
    (!formValues.ankeOmgjoerArsak || !formValues.ankeVurderingOmgjoer)
  ) {
    return false;
  }
  return formValues.ankeVurdering != null && formValues.vedtak != null;
};

const IKKE_PAA_ANKET_BEHANDLING_ID = '0';

const canPreview = (begrunnelse, fritekstTilBrev) =>
  begrunnelse && begrunnelse.length > 0 && fritekstTilBrev && fritekstTilBrev.length > 0;

const formatDate = date => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');

const formatId = b => {
  if (b === null) {
    return IKKE_PAA_ANKET_BEHANDLING_ID;
  }
  return `${b}`;
};

/**
 * Presentasjonskomponent. Setter opp aksjonspunktet for behandling.
 */
const BehandleAnkeFormImpl = ({
  behandlingId,
  behandlingVersjon,
  readOnly = false,
  handleSubmit,
  saveAnke,
  previewCallback,
  readOnlySubmitButton = false,
  aksjonspunktCode,
  sprakkode,
  formValues = {},
  behandlinger,
  intl,
  ...formProps
}) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();

  const leggTilUkjent = (behandlingerArray = []) => {
    const arr = [].concat(behandlingerArray);
    arr.unshift({
      id: IKKE_PAA_ANKET_BEHANDLING_ID,
      opprettet: null,
      type: {},
      status: {},
    });
    return arr;
  };

  const filtrerKlage = behandlinger?.filter(b => b.type === behandlingType.KLAGE);

  const buildOption = b => {
    if (b.id === IKKE_PAA_ANKET_BEHANDLING_ID) {
      return (
        <option key={formatId(b.id)} value={formatId(b.id)}>
          {intl.formatMessage({ id: 'Ankebehandling.Resultat.IkkePaaAnketVedtak' })}
        </option>
      );
    }
    return (
      <option key={formatId(b.id)} value={formatId(b.id)}>
        {formatDate(b.opprettet)} - {kodeverkNavnFraKode(KodeverkType.BEHANDLING_TYPE)} -{' '}
        {kodeverkNavnFraKode(KodeverkType.BEHANDLING_STATUS)}
      </option>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <FadingPanel>
        <Heading size="small" level="2">
          <FormattedMessage id="Ankebehandling.Title" />
        </Heading>
        <VerticalSpacer fourPx />
        <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton}>
          {[<FormattedMessage id="Ankebehandling.HelpText" key={aksjonspunktCode} />]}
        </AksjonspunktHelpText>
        <VerticalSpacer sixteenPx />
        <HGrid gap="1" columns={{ xs: '7fr 5fr' }}>
          <div>
            <SelectField
              readOnly={readOnly}
              name="vedtak"
              selectValues={leggTilUkjent(filtrerKlage).map(b => buildOption(b))}
              className={readOnly ? styles.selectReadOnly : null}
              label={intl.formatMessage({ id: 'Ankebehandling.Resultat.Vedtak' })}
              validate={[required]}
              bredde="xl"
            />
          </div>
        </HGrid>

        <BodyShort size="small">
          <FormattedMessage id="Ankebehandling.Resultat" />
        </BodyShort>
        <HGrid gap="1" columns={{ xs: '4fr 4fr 4fr' }}>
          <RadioGroupField
            name="ankeVurdering"
            validate={[required]}
            isVertical
            readOnly={readOnly}
            radios={[
              {
                value: ankeVurdering.ANKE_STADFESTE_YTELSESVEDTAK,
                label: intl.formatMessage({ id: 'Ankebehandling.Resultat.Stadfest' }),
              },
              {
                value: ankeVurdering.ANKE_OMGJOER,
                label: intl.formatMessage({ id: 'Ankebehandling.Resultat.Omgjør' }),
              },
            ]}
          />
          <RadioGroupField
            name="ankeVurdering"
            validate={[required]}
            readOnly={readOnly}
            className={readOnly ? styles.selectReadOnly : null}
            isVertical
            radios={[
              {
                value: ankeVurdering.ANKE_OPPHEVE_OG_HJEMSENDE,
                label: intl.formatMessage({ id: 'Ankebehandling.Resultat.OpphevHjemsend' }),
              },
              {
                value: ankeVurdering.ANKE_AVVIS,
                label: intl.formatMessage({ id: 'Ankebehandling.Resultat.Avvis' }),
              },
            ]}
          />
        </HGrid>
        {ankeVurdering.ANKE_AVVIS === formValues.ankeVurdering && (
          <HGrid gap="1" columns={{ xs: '7fr 5fr' }}>
            <div>
              <ArrowBox>
                <BodyShort size="small">
                  <FormattedMessage id="Ankebehandling.Avvisning" />
                </BodyShort>
                <CheckboxField
                  name="erAnkerIkkePart"
                  label={<FormattedMessage id="Ankebehandling.Avvisning.IkkePart" />}
                />
                <CheckboxField
                  name="erIkkeKonkret"
                  label={<FormattedMessage id="Ankebehandling.Avvisning.IkkeKonkret" />}
                />
                <CheckboxField
                  name="erFristIkkeOverholdt"
                  label={<FormattedMessage id="Ankebehandling.Avvisning.IkkeFrist" />}
                />
                <CheckboxField
                  name="erIkkeSignert"
                  label={<FormattedMessage id="Ankebehandling.Avvisning.IkkeSignert" />}
                />
                <BodyShort size="small">
                  <FormattedMessage id="Ankebehandling.Realitetsbehandles" />
                </BodyShort>
                <RadioGroupField
                  name="erSubsidiartRealitetsbehandles"
                  validate={[required]}
                  readOnly={readOnly}
                  className={readOnly ? styles.selectReadOnly : null}
                  direction="horisontal"
                  radios={[
                    {
                      value: true,
                      label: intl.formatMessage({ id: 'Ankebehandling.Realitetsbehandles.Ja' }),
                    },
                    {
                      value: false,
                      label: intl.formatMessage({ id: 'Ankebehandling.Realitetsbehandles.Nei' }),
                    },
                  ]}
                />
              </ArrowBox>
            </div>
          </HGrid>
        )}
        {ankeVurdering.ANKE_OMGJOER === formValues.ankeVurdering && (
          <HGrid gap="1" columns={{ xs: '7fr 5fr' }}>
            <div>
              <ArrowBox>
                <RadioGroupField
                  name="ankeVurderingOmgjoer"
                  validate={[required]}
                  readOnly={readOnly}
                  className={readOnly ? styles.selectReadOnly : null}
                  radios={[
                    {
                      value: ankeVurderingOmgjoer.ANKE_TIL_GUNST,
                      label: intl.formatMessage({ id: 'Ankebehandling.VurderingOmgjoer.Gunst' }),
                    },
                    {
                      value: ankeVurderingOmgjoer.ANKE_TIL_UGUNST,
                      label: intl.formatMessage({ id: 'Ankebehandling.VurderingOmgjoer.Ugunst' }),
                    },
                    {
                      value: ankeVurderingOmgjoer.ANKE_DELVIS_OMGJOERING_TIL_GUNST,
                      label: intl.formatMessage({ id: 'Ankebehandling.VurderingOmgjoer.Delvis' }),
                    },
                  ]}
                />
                <SelectField
                  readOnly={readOnly}
                  name="ankeOmgjoerArsak"
                  selectValues={omgjorArsakValues.map(arsak => (
                    <option key={arsak.kode} value={arsak.kode}>
                      {intl.formatMessage({ id: arsak.navn })}
                    </option>
                  ))}
                  className={readOnly ? styles.selectReadOnly : null}
                  label={intl.formatMessage({ id: 'Ankebehandling.OmgjoeringArsak' })}
                  validate={[required]}
                  bredde="xl"
                />
              </ArrowBox>
            </div>
          </HGrid>
        )}

        <HGrid gap="1" columns={{ xs: '7fr 5fr' }}>
          <TextAreaField label="Begrunnelse" name="begrunnelse" readOnly={readOnly} />
        </HGrid>

        <div className={styles.confirmVilkarForm}>
          <VerticalSpacer sixteenPx />
          <FritekstBrevTextField sprakkode={sprakkode} readOnly={readOnly} intl={intl} />
          <VerticalSpacer sixteenPx />
          <HGrid gap="1" columns={{ xs: '8fr 2fr 2fr' }}>
            <div>
              <ProsessStegSubmitButton
                formName={formProps.form}
                behandlingId={behandlingId}
                behandlingVersjon={behandlingVersjon}
                isReadOnly={readOnly}
                isSubmittable={!readOnly && canSubmit(formValues)}
                hasEmptyRequiredFields={false}
                isBehandlingFormSubmitting={isBehandlingFormSubmitting}
                isBehandlingFormDirty={isBehandlingFormDirty}
                hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
              />
              <PreviewAnkeLink
                readOnly={!canPreview(formValues.begrunnelse, formValues.fritekstTilBrev)}
                previewCallback={previewCallback}
                fritekstTilBrev={formValues.fritekstTilBrev}
                ankeVurdering={formValues.ankeVurdering}
                aksjonspunktCode={aksjonspunktCode}
              />
            </div>
            <div>
              <TempsaveAnkeButton
                formValues={formValues}
                saveAnke={saveAnke}
                readOnly={readOnly}
                aksjonspunktCode={aksjonspunktCode}
              />
            </div>
          </HGrid>
        </div>
      </FadingPanel>
    </form>
  );
};

BehandleAnkeFormImpl.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  previewCallback: PropTypes.func.isRequired,
  saveAnke: PropTypes.func.isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  formValues: PropTypes.shape(),
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  behandlinger: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      opprettet: PropTypes.string,
      type: PropTypes.string, // kodeverk
      status: PropTypes.string, // kodeverk
    }),
  ).isRequired,
  ...formPropTypes,
};

// TODO (TOR) Her ligg det masse som ikkje er felt i forma! Rydd
export const buildInitialValues = createSelector([ownProps => ownProps.ankeVurderingResultat], resultat => ({
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

// TODO (TOR) Rydd i dette! Treng neppe senda med alt dette til backend
export const transformValues = (values, aksjonspunktCode) => ({
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

const formName = 'BehandleAnkeForm';

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const aksjonspunktCode = initialOwnProps.aksjonspunkter[0].definisjon;
  const onSubmit = values => initialOwnProps.submitCallback([transformValues(values, aksjonspunktCode)]);
  return (state, ownProps) => ({
    aksjonspunktCode,
    initialValues: buildInitialValues(ownProps),
    formValues: behandlingFormValueSelector(formName, ownProps.behandlingId, ownProps.behandlingVersjon)(
      state,
      'vedtak',
      'ankeVurdering',
      'begrunnelse',
      'fritekstTilBrev',
      'erSubsidiartRealitetsbehandles',
      'ankeOmgjoerArsak',
      'ankeVurderingOmgjoer',
    ),
    onSubmit,
  });
};

const BehandleAnkeForm = connect(mapStateToPropsFactory)(
  behandlingForm({
    form: formName,
  })(BehandleAnkeFormImpl),
);

BehandleAnkeForm.supports = apCodes => apCodes.includes(aksjonspunktCodes.MANUELL_VURDERING_AV_ANKE);

export default injectIntl(BehandleAnkeForm);
