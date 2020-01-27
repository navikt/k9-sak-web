import React from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { InjectedFormProps } from 'redux-form';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { ElementWrapper, FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getKodeverknavnFn, behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import klageVurderingCodes from '@fpsak-frontend/kodeverk/src/klageVurdering';
import AlleKodeverk from '@k9-frontend/types/src/kodeverk';
import KlageVurderingResultat from '@k9-frontend/types/src/klage/klageVurderingResultatType';
import KlageVurdering from '@k9-frontend/types/src/klage/klageVurderingTsType';
import Behandlingsresultat from '@k9-frontend/types/src/totrinnskontroll/Behandlingsresultat';
import Aksjonspunkt from '@k9-frontend/types/src/aksjonspunktTsType';

import VedtakKlageSubmitPanel from './VedtakKlageSubmitPanel';
import VedtakKlageKaSubmitPanel from './VedtakKlageKaSubmitPanel';
import { PreviewVedtakCallbackProps } from '../VedtakKlageProsessIndex';

export const VEDTAK_KLAGE_FORM_NAME = 'VEDTAK_KLAGE_FORM';

const getPreviewVedtakCallback = previewVedtakCallback => () =>
  previewVedtakCallback({
    gjelderVedtak: true,
  });

type AvvistArsak = {
  kode: string,
};

interface VedtakKlageFormProps {
  readOnly: boolean;
  omgjortAarsak?: string;
  previewVedtakCallback: (data: PreviewVedtakCallbackProps) => Promise<any>;
  isAvvist: boolean;
  isOmgjort: boolean;
  fritekstTilBrev?: string;
  isOpphevOgHjemsend: boolean;
  avvistArsaker: AvvistArsak[];
  behandlingsResultatTekst: string;
  klageVurdering: KlageVurderingResultat;
  behandlingPaaVent: boolean;
  alleKodeverk: AlleKodeverk;
}

/**
 * VedtakKlageForm
 *
 * Redux-form-komponent for klage-vedtak.
 */
export const VedtakKlageFormImpl: React.FunctionComponent<VedtakKlageFormProps & InjectedFormProps> = ({
  readOnly,
  omgjortAarsak,
  previewVedtakCallback,
  isAvvist,
  isOmgjort,
  fritekstTilBrev,
  isOpphevOgHjemsend,
  avvistArsaker,
  behandlingsResultatTekst,
  klageVurdering,
  behandlingPaaVent,
  alleKodeverk,
  ...formProps
}) => {
  const kodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  const intl = useIntl();

  return (
    <FadingPanel>
      <Undertittel>{intl.formatMessage({ id: 'VedtakKlageForm.Header' })}</Undertittel>
      <VerticalSpacer twentyPx />
      <ElementWrapper>
        <div>
          <Undertekst>{intl.formatMessage({ id: 'VedtakKlageForm.Resultat' })}</Undertekst>
        </div>
        <Normaltekst>{intl.formatMessage({ id: behandlingsResultatTekst })}</Normaltekst>
        <VerticalSpacer sixteenPx />
        {isAvvist && (
          <div>
            <Undertekst>{intl.formatMessage({ id: 'VedtakKlageForm.ArsakTilAvvisning' })}</Undertekst>
            {avvistArsaker.map(arsak => (
              <Normaltekst key={arsak.kode}>{kodeverknavn(arsak)}</Normaltekst>
            ))}
            <VerticalSpacer sixteenPx />
          </div>
        )}
        {isOmgjort && (
          <div>
            <Undertekst>{intl.formatMessage({ id: 'VedtakKlageForm.ArsakTilOmgjoring' })}</Undertekst>
            {omgjortAarsak}
            <VerticalSpacer sixteenPx />
          </div>
        )}
        {isOpphevOgHjemsend && (
          <div>
            <Undertekst>{intl.formatMessage({ id: 'VedtakKlageForm.ArsakTilOppheving' })}</Undertekst>
            {omgjortAarsak}
            <VerticalSpacer sixteenPx />
          </div>
        )}
        {klageVurdering.klageVurdertAv === 'NK' && (
          <VedtakKlageKaSubmitPanel
            begrunnelse={fritekstTilBrev}
            klageResultat={klageVurdering}
            previewVedtakCallback={getPreviewVedtakCallback(previewVedtakCallback)}
            formProps={formProps}
            readOnly={readOnly}
            behandlingPaaVent={behandlingPaaVent}
          />
        )}
        {klageVurdering.klageVurdertAv === 'NFP' && (
          <VedtakKlageSubmitPanel
            begrunnelse={fritekstTilBrev}
            klageResultat={klageVurdering}
            previewVedtakCallback={getPreviewVedtakCallback(previewVedtakCallback)}
            formProps={formProps}
            readOnly={readOnly}
            behandlingPaaVent={behandlingPaaVent}
          />
        )}
      </ElementWrapper>
    </FadingPanel>
  );
};

VedtakKlageFormImpl.defaultProps = {
  omgjortAarsak: undefined,
  avvistArsaker: undefined,
  fritekstTilBrev: undefined,
};

interface OwnProps {
  klageVurdering: KlageVurdering;
  behandlingsresultat: Behandlingsresultat;
  aksjonspunkter: Aksjonspunkt[];
}

const transformValues = values =>
  values.aksjonspunktKoder.map(apCode => ({
    kode: apCode,
    begrunnelse: values.fritekstTilBrev,
  }));

export const getAvvisningsAarsaker = createSelector(
  [(ownProps: OwnProps) => ownProps.klageVurdering],
  klageVurderingResultat => {
    if (klageVurderingResultat) {
      if (klageVurderingResultat.klageFormkravResultatKA && klageVurderingResultat.klageVurderingResultatNK) {
        return klageVurderingResultat.klageFormkravResultatKA.avvistArsaker;
      }
      if (klageVurderingResultat.klageFormkravResultatNFP) {
        return klageVurderingResultat.klageFormkravResultatNFP.avvistArsaker;
      }
    }
    return null;
  },
);

const omgjoerTekstMap = {
  GUNST_MEDHOLD_I_KLAGE: 'VedtakKlageForm.KlageOmgjortGunst',
  UGUNST_MEDHOLD_I_KLAGE: 'VedtakKlageForm.KlageOmgjortUgunst',
  DELVIS_MEDHOLD_I_KLAGE: 'VedtakKlageForm.KlageOmgjortDelvis',
};

const getKlageResultat = createSelector([(ownProps: OwnProps) => ownProps.klageVurdering], behandlingKlageVurdering =>
  behandlingKlageVurdering.klageVurderingResultatNK
    ? behandlingKlageVurdering.klageVurderingResultatNK
    : behandlingKlageVurdering.klageVurderingResultatNFP,
);

const getResultatText = createSelector([(ownProps: OwnProps) => ownProps.klageVurdering], behandlingKlageVurdering => {
  const klageResultat = behandlingKlageVurdering.klageVurderingResultatNK
    ? behandlingKlageVurdering.klageVurderingResultatNK
    : behandlingKlageVurdering.klageVurderingResultatNFP;
  switch (klageResultat.klageVurdering) {
    case klageVurderingCodes.AVVIS_KLAGE:
      return 'VedtakKlageForm.KlageAvvist';
    case klageVurderingCodes.STADFESTE_YTELSESVEDTAK:
      return 'VedtakKlageForm.KlageStadfestet';
    case klageVurderingCodes.OPPHEVE_YTELSESVEDTAK:
      return 'VedtakKlageForm.YtelsesvedtakOpphevet';
    case klageVurderingCodes.HJEMSENDE_UTEN_Å_OPPHEVE:
      return 'VedtakKlageForm.HjemmsendUtenOpphev';
    case klageVurderingCodes.MEDHOLD_I_KLAGE:
      return omgjoerTekstMap[klageResultat.klageVurderingOmgjoer];
    default:
      return null;
  }
});

const getOmgjortAarsak = createSelector([(ownProps: OwnProps) => ownProps.klageVurdering], klageVurderingResultat => {
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
  [(ownProps: OwnProps) => ownProps.behandlingsresultat],
  behandlingsresultat => behandlingsresultat.type.kode === behandlingResultatType.KLAGE_MEDHOLD,
);

export const getIsAvvist = createSelector(
  [(ownProps: OwnProps) => ownProps.behandlingsresultat],
  behandlingsresultat => behandlingsresultat.type.kode === behandlingResultatType.KLAGE_AVVIST,
);

export const getIsOpphevOgHjemsend = createSelector(
  [(ownProps: OwnProps) => ownProps.behandlingsresultat],
  behandlingsresultat => behandlingsresultat.type.kode === behandlingResultatType.KLAGE_YTELSESVEDTAK_OPPHEVET,
);

export const getFritekstTilBrev = createSelector(
  [(ownProps: OwnProps) => ownProps.klageVurdering],
  behandlingKlageVurdering => {
    const klageResultat = behandlingKlageVurdering.klageVurderingResultatNK
      ? behandlingKlageVurdering.klageVurderingResultatNK
      : behandlingKlageVurdering.klageVurderingResultatNFP;
    return klageResultat.fritekstTilBrev;
  },
);

export const buildInitialValues = createSelector([(ownProps: OwnProps) => ownProps.aksjonspunkter], aksjonspunkter => {
  const behandlingAksjonspunktCodes = aksjonspunkter.map(ap => ap.definisjon.kode);
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
    klageVurdering: getKlageResultat(ownProps),
    ...behandlingFormValueSelector(VEDTAK_KLAGE_FORM_NAME, ownProps.behandlingId, ownProps.behandlingVersjon)(
      state,
      'begrunnelse',
      'aksjonspunktKoder',
    ),
  });
};

const VedtakKlageForm = connect(mapStateToPropsFactory)(
  behandlingForm({
    form: VEDTAK_KLAGE_FORM_NAME,
  })(VedtakKlageFormImpl),
);

export default VedtakKlageForm;
