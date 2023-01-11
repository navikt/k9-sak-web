import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { AksjonspunktHelpTextTemp, FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import klageVurderingCodes from '@fpsak-frontend/kodeverk/src/klageVurdering';

import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import VedtakKlageNkkSubmitPanel from './VedtakKlageNkkSubmitPanel';
import VedtakKlageSubmitPanel from './VedtakKlageSubmitPanel';
import VedtakKlageKaSubmitPanel from './VedtakKlageKaSubmitPanel';

export const VEDTAK_KLAGE_FORM_NAME = 'VEDTAK_KLAGE_FORM';

const getPreviewVedtakCallback = previewVedtakCallback => () =>
  previewVedtakCallback({
    dokumentMal: dokumentMalType.UTLED,
  });

/**
 * VedtakKlageForm
 *
 * Redux-form-komponent for klage-vedtak.
 */
export const VedtakKlageFormImpl = ({
  readOnly,
  omgjortAarsak,
  previewVedtakCallback,
  isAvvist,
  isOmgjort,
  fritekstTilBrev,
  isOpphevOgHjemsend,
  avvistArsaker,
  behandlingsResultatTekst,
  klageresultat,
  behandlingPaaVent,
  alleKodeverk,
  åpneAksjonspunktKoder,
  ...formProps
}) => {
  const intl = useIntl();
  const kodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);

  return (
    <FadingPanel>
      <Undertittel>{intl.formatMessage({ id: 'VedtakKlageForm.Header' })}</Undertittel>
      <VerticalSpacer twentyPx />
      {!readOnly && åpneAksjonspunktKoder.includes(aksjonspunktCodes.VURDERE_DOKUMENT) ? (
        <>
          <AksjonspunktHelpTextTemp isAksjonspunktOpen>
            {intl.formatMessage({ id: 'VedtakKlageForm.VurderDokument' })}
          </AksjonspunktHelpTextTemp>
          <VerticalSpacer eightPx />
        </>
      ) : null}
      <>
        <div>
          <Undertekst>{intl.formatMessage({ id: 'VedtakKlageForm.Resultat' })}</Undertekst>
        </div>
        {behandlingsResultatTekst && <Normaltekst>{intl.formatMessage({ id: behandlingsResultatTekst })}</Normaltekst>}
        <VerticalSpacer sixteenPx />
        {isAvvist && Array.isArray(avvistArsaker) && avvistArsaker.length > 0 && (
          <div>
            <Undertekst>{intl.formatMessage({ id: 'VedtakKlageForm.ArsakTilAvvisning' })}</Undertekst>
            {avvistArsaker.map(arsak => (
              <Normaltekst key={arsak}>{kodeverknavn(arsak, kodeverkTyper.KLAGE_AVVIST_AARSAK)}</Normaltekst>
            ))}
            <VerticalSpacer sixteenPx />
          </div>
        )}
        {isOmgjort && omgjortAarsak && (
          <div>
            <Undertekst>{intl.formatMessage({ id: 'VedtakKlageForm.ArsakTilOmgjoring' })}</Undertekst>
            {omgjortAarsak}
            <VerticalSpacer sixteenPx />
          </div>
        )}
        {isOpphevOgHjemsend && omgjortAarsak && (
          <div>
            <Undertekst>{intl.formatMessage({ id: 'VedtakKlageForm.ArsakTilOppheving' })}</Undertekst>
            {omgjortAarsak}
            <VerticalSpacer sixteenPx />
          </div>
        )}

        {klageresultat.klageVurdertAv === 'NKK' && (
          <VedtakKlageNkkSubmitPanel
            begrunnelse={fritekstTilBrev}
            klageResultat={klageresultat}
            formProps={formProps}
            readOnly={readOnly}
            behandlingPaaVent={behandlingPaaVent}
          />
        )}

        {klageresultat.klageVurdertAv === 'NK' && (
          <VedtakKlageKaSubmitPanel
            begrunnelse={fritekstTilBrev}
            klageResultat={klageresultat}
            previewVedtakCallback={getPreviewVedtakCallback(previewVedtakCallback)}
            formProps={formProps}
            readOnly={readOnly}
            behandlingPaaVent={behandlingPaaVent}
          />
        )}

        {(klageresultat.klageVurdertAv === 'NAY' || klageresultat.klageVurdertAv === 'NFP') && (
          <VedtakKlageSubmitPanel
            begrunnelse={fritekstTilBrev}
            klageResultat={klageresultat}
            previewVedtakCallback={getPreviewVedtakCallback(previewVedtakCallback)}
            formProps={formProps}
            readOnly={readOnly}
            behandlingPaaVent={behandlingPaaVent}
          />
        )}
      </>
    </FadingPanel>
  );
};

VedtakKlageFormImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAvvist: PropTypes.bool.isRequired,
  isOmgjort: PropTypes.bool.isRequired,
  isOpphevOgHjemsend: PropTypes.bool.isRequired,
  behandlingsResultatTekst: PropTypes.string,
  klageVurdering: PropTypes.shape().isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
  avvistArsaker: PropTypes.arrayOf(PropTypes.string),
  omgjortAarsak: PropTypes.string,
  fritekstTilBrev: PropTypes.string,
  behandlingsresultat: PropTypes.shape(),
  ...formPropTypes,
};

VedtakKlageFormImpl.defaultProps = {
  omgjortAarsak: undefined,
  avvistArsaker: undefined,
  fritekstTilBrev: undefined,
};

const transformValues = values =>
  values.aksjonspunktKoder.map(apCode => ({
    kode: apCode,
    begrunnelse: values.fritekstTilBrev,
  }));

export const getAvvisningsAarsaker = createSelector([ownProps => ownProps.klageVurdering], klageVurderingResultat => {
  if (klageVurderingResultat) {
    if (klageVurderingResultat.klageFormkravResultatKA && klageVurderingResultat.klageVurderingResultatNK) {
      return klageVurderingResultat.klageFormkravResultatKA.avvistArsaker;
    }
    if (klageVurderingResultat.klageFormkravResultatNFP) {
      return klageVurderingResultat.klageFormkravResultatNFP.avvistArsaker;
    }
  }
  return null;
});

const omgjoerTekstMap = {
  GUNST_MEDHOLD_I_KLAGE: 'VedtakKlageForm.KlageOmgjortGunst',
  UGUNST_MEDHOLD_I_KLAGE: 'VedtakKlageForm.KlageOmgjortUgunst',
  DELVIS_MEDHOLD_I_KLAGE: 'VedtakKlageForm.KlageOmgjortDelvis',
};

export const getKlageresultat = createSelector(
  [ownProps => ownProps.klageVurdering],
  kv => kv.klageVurderingResultatNK || kv.klageVurderingResultatNFP,
);

const getResultatText = createSelector([getKlageresultat], klageresultat => {
  switch (klageresultat.klageVurdering) {
    case klageVurderingCodes.AVVIS_KLAGE:
      return 'VedtakKlageForm.KlageAvvist';
    case klageVurderingCodes.STADFESTE_YTELSESVEDTAK:
      return 'VedtakKlageForm.KlageStadfestet';
    case klageVurderingCodes.OPPHEVE_YTELSESVEDTAK:
      return 'VedtakKlageForm.YtelsesvedtakOpphevet';
    case klageVurderingCodes.HJEMSENDE_UTEN_Å_OPPHEVE:
      return 'VedtakKlageForm.HjemmsendUtenOpphev';
    case klageVurderingCodes.TRUKKET_KLAGE:
      return 'VedtakKlageForm.Trukket';
    case klageVurderingCodes.MEDHOLD_I_KLAGE:
      return omgjoerTekstMap[klageresultat.klageVurderingOmgjoer];
    default:
      return null;
  }
});

const getOmgjortAarsak = createSelector([ownProps => ownProps.klageVurdering], klageVurderingResultat => {
  if (klageVurderingResultat) {
    if (klageVurderingResultat.klageVurderingResultatNK) {
      return klageVurderingResultat.klageVurderingResultatNK.klageMedholdArsakNavn;
    }
    if (klageVurderingResultat.klageVurderingResultatNFP) {
      return klageVurderingResultat.klageVurderingResultatNFP.klageMedholdArsakNavn;
    }
  }
  return null;
});

const getIsOmgjort = createSelector(
  [getKlageresultat],
  klageresultat => klageresultat.klageVurdering === klageVurderingCodes.MEDHOLD_I_KLAGE,
);

export const getIsAvvist = createSelector(
  [getKlageresultat],
  klageresultat => klageresultat.klageVurdering === klageVurderingCodes.AVVIS_KLAGE,
);

export const getIsOpphevOgHjemsend = createSelector(
  [getKlageresultat],
  klageresultat => klageresultat.klageVurdering === klageVurderingCodes.OPPHEVE_YTELSESVEDTAK,
);

const getÅpneAksjonspunktKoder = createSelector([ownProps => ownProps.aksjonspunkter], aksjonspunkter =>
  Array.isArray(aksjonspunkter)
    ? aksjonspunkter.filter(ap => ap.status === aksjonspunktStatus.OPPRETTET && ap.kanLoses).map(ap => ap.definisjon)
    : [],
);

export const getFritekstTilBrev = createSelector([getKlageresultat], klageresultat => klageresultat.fritekstTilBrev);

export const buildInitialValues = createSelector([ownProps => ownProps.aksjonspunkter], aksjonspunkter => {
  const behandlingAksjonspunktCodes = aksjonspunkter.map(ap => ap.definisjon);
  return {
    aksjonspunktKoder: behandlingAksjonspunktCodes,
  };
});

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => initialOwnProps.submitCallback(transformValues(values));
  return (state, ownProps) => ({
    onSubmit,
    initialValues: buildInitialValues(ownProps),
    isAvvist: getIsAvvist(ownProps),
    avvistArsaker: getAvvisningsAarsaker(ownProps),
    isOpphevOgHjemsend: getIsOpphevOgHjemsend(ownProps),
    isOmgjort: getIsOmgjort(ownProps),
    omgjortAarsak: getOmgjortAarsak(ownProps),
    fritekstTilBrev: getFritekstTilBrev(ownProps),
    behandlingsResultatTekst: getResultatText(ownProps),
    klageresultat: getKlageresultat(ownProps),
    ...behandlingFormValueSelector(VEDTAK_KLAGE_FORM_NAME, ownProps.behandlingId, ownProps.behandlingVersjon)(
      state,
      'begrunnelse',
      'aksjonspunktKoder',
    ),
    åpneAksjonspunktKoder: getÅpneAksjonspunktKoder(ownProps),
  });
};

const VedtakKlageForm = connect(mapStateToPropsFactory)(
  behandlingForm({
    form: VEDTAK_KLAGE_FORM_NAME,
  })(VedtakKlageFormImpl),
);

export default VedtakKlageForm;
