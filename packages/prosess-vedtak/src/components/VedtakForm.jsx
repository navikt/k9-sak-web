import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { clearFields, formPropTypes } from 'redux-form';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Column, Row } from 'nav-frontend-grid';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { isAvslag, isInnvilget } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix } from '@fpsak-frontend/form';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { dokumentdatatype } from '@k9-sak-web/konstanter';
import { decodeHtmlEntity, safeJSONParse } from '@fpsak-frontend/utils';
import {
  kanHaFritekstbrev,
  harOverstyrtMedFritekstbrev,
  harOverstyrtMedIngenBrev,
  harBareFritekstbrev,
} from '@fpsak-frontend/utils/src/formidlingUtils';
import vedtakBeregningsresultatPropType from '../propTypes/vedtakBeregningsresultatPropType';
import vedtakVilkarPropType from '../propTypes/vedtakVilkarPropType';
import VedtakInnvilgetPanel from './VedtakInnvilgetPanel';
import VedtakAvslagPanel from './VedtakAvslagPanel';
import VedtakAksjonspunktPanel from './VedtakAksjonspunktPanel';
import styles from './vedtakForm.less';
import VedtakOverstyrendeKnapp from './VedtakOverstyrendeKnapp';
import BrevPanel from './brev/BrevPanel';

const isVedtakSubmission = true;

const kanSendesTilGodkjenning = behandlingStatusKode =>
  behandlingStatusKode === behandlingStatusCode.BEHANDLING_UTREDES;

const formName = 'VedtakForm';

export class VedtakForm extends Component {
  constructor(props) {
    super(props);
    this.onToggleOverstyring = this.onToggleOverstyring.bind(this);
    this.state = {
      skalBrukeOverstyrendeFritekstBrev: props.skalBrukeOverstyrendeFritekstBrev,
    };
  }

  onToggleOverstyring() {
    const { behandlingFormPrefix, clearFields: clearFormFields } = this.props;
    const { skalBrukeOverstyrendeFritekstBrev } = this.state;
    this.setState({
      skalBrukeOverstyrendeFritekstBrev: !skalBrukeOverstyrendeFritekstBrev,
    });
    const fields = ['begrunnelse', 'overskrift', 'brødtekst'];
    clearFormFields(`${behandlingFormPrefix}.VedtakForm`, false, false, ...fields);
  }

  render() {
    const {
      intl,
      readOnly,
      behandlingStatusKode,
      behandlingresultat,
      aksjonspunkter,
      behandlingPaaVent,
      antallBarn,
      previewCallback,
      aksjonspunktKoder,
      sprakkode,
      skalBrukeOverstyrendeFritekstBrev,
      initialValues,
      ytelseTypeKode,
      resultatstruktur,
      alleKodeverk,
      personopplysninger,
      arbeidsgiverOpplysningerPerId,
      tilbakekrevingvalg,
      simuleringResultat,
      vilkar,
      beregningErManueltFastsatt,
      tilgjengeligeVedtaksbrev,
      dokumentdata,
      brødtekst,
      overskrift,
      begrunnelse,
      overstyrtMottaker,
      ...formProps
    } = this.props;

    return (
      <>
        <VedtakAksjonspunktPanel
          behandlingStatusKode={behandlingStatusKode}
          aksjonspunktKoder={aksjonspunktKoder}
          readOnly={readOnly}
        >
          {ytelseTypeKode === fagsakYtelseType.FRISINN ? (
            <VedtakOverstyrendeKnapp readOnly={readOnly} keyName="skalUndertrykkeBrev" readOnlyHideEmpty={false} />
          ) : (
            kanHaFritekstbrev(tilgjengeligeVedtaksbrev) && (
              <VedtakOverstyrendeKnapp
                toggleCallback={this.onToggleOverstyring}
                readOnly={readOnly || initialValues.skalBrukeOverstyrendeFritekstBrev === true}
                keyName="skalBrukeOverstyrendeFritekstBrev"
                readOnlyHideEmpty={false}
              />
            )
          )}

          {isInnvilget(behandlingresultat.type.kode) && (
            <VedtakInnvilgetPanel
              intl={intl}
              antallBarn={antallBarn}
              behandlingsresultat={behandlingresultat}
              readOnly={readOnly}
              skalBrukeOverstyrendeFritekstBrev={skalBrukeOverstyrendeFritekstBrev}
              ytelseTypeKode={ytelseTypeKode}
              aksjonspunkter={aksjonspunkter}
              sprakkode={sprakkode}
              beregningResultat={resultatstruktur}
              alleKodeverk={alleKodeverk}
              tilbakekrevingvalg={tilbakekrevingvalg}
            />
          )}

          {isAvslag(behandlingresultat.type.kode) && (
            <VedtakAvslagPanel
              behandlingStatusKode={behandlingStatusKode}
              aksjonspunkter={aksjonspunkter}
              behandlingsresultat={behandlingresultat}
              readOnly={readOnly}
              ytelseTypeKode={ytelseTypeKode}
              sprakkode={sprakkode}
              alleKodeverk={alleKodeverk}
              tilbakekrevingvalg={tilbakekrevingvalg}
              simuleringResultat={simuleringResultat}
              vilkar={vilkar}
            />
          )}

          <BrevPanel
            intl={intl}
            readOnly={readOnly}
            sprakkode={sprakkode}
            ytelseTypeKode={ytelseTypeKode}
            personopplysninger={personopplysninger}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
            dokumentdata={dokumentdata}
            tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
            beregningErManueltFastsatt={beregningErManueltFastsatt}
            skalBrukeOverstyrendeFritekstBrev={skalBrukeOverstyrendeFritekstBrev}
            previewCallback={previewCallback}
            formProps={formProps}
            brødtekst={brødtekst}
            overskrift={overskrift}
            begrunnelse={begrunnelse}
            overstyrtMottaker={overstyrtMottaker}
          />
          {kanSendesTilGodkjenning(behandlingStatusKode) && (
            <Row>
              <Column xs="12">
                {!readOnly && (
                  <Hovedknapp
                    mini
                    className={styles.mainButton}
                    onClick={formProps.handleSubmit}
                    disabled={behandlingPaaVent || formProps.submitting}
                    spinner={formProps.submitting}
                  >
                    {intl.formatMessage({
                      id:
                        !skalBrukeOverstyrendeFritekstBrev &&
                        aksjonspunktKoder.includes(aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL)
                          ? 'VedtakForm.FattVedtak'
                          : 'VedtakForm.TilGodkjenning',
                    })}
                  </Hovedknapp>
                )}
              </Column>
            </Row>
          )}
        </VedtakAksjonspunktPanel>
      </>
    );
  }
}

VedtakForm.propTypes = {
  resultatstruktur: vedtakBeregningsresultatPropType,
  intl: PropTypes.shape().isRequired,
  antallBarn: PropTypes.number,
  behandlingStatusKode: PropTypes.string.isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingresultat: PropTypes.shape().isRequired,
  behandlingPaaVent: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  kanOverstyre: PropTypes.bool,
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool,
  sprakkode: kodeverkObjektPropType.isRequired,
  erBehandlingEtterKlage: PropTypes.bool.isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  personopplysninger: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  tilbakekrevingvalg: PropTypes.shape(),
  simuleringResultat: PropTypes.shape(),
  beregningErManueltFastsatt: PropTypes.bool.isRequired,
  vilkar: PropTypes.arrayOf(vedtakVilkarPropType.isRequired),
  tilgjengeligeVedtaksbrev: PropTypes.oneOfType([PropTypes.shape(), PropTypes.arrayOf(PropTypes.string)]),
  dokumentdata: PropTypes.shape(),
  ...formPropTypes,
};

VedtakForm.defaultProps = {
  antallBarn: undefined,
  kanOverstyre: undefined,
  resultatstruktur: undefined,
  skalBrukeOverstyrendeFritekstBrev: false,
  tilgjengeligeVedtaksbrev: undefined,
  dokumentdata: undefined,
};

export const buildInitialValues = createSelector(
  [
    ownProps => ownProps.behandlingStatus,
    ownProps => ownProps.resultatstruktur,
    ownProps => ownProps.aksjonspunkter,
    ownProps => ownProps.ytelseTypeKode,
    ownProps => ownProps.behandlingresultat,
    ownProps => ownProps.sprakkode,
    ownProps => ownProps.vedtakVarsel,
    ownProps => ownProps.dokumentdata,
    ownProps => ownProps.tilgjengeligeVedtaksbrev,
    ownProps => ownProps.readOnly,
  ],
  (
    status,
    beregningResultat,
    aksjonspunkter,
    ytelseTypeKode,
    behandlingresultat,
    sprakkode,
    vedtakVarsel,
    dokumentdata,
    tilgjengeligeVedtaksbrev,
    readonly,
  ) => ({
    sprakkode,
    isEngangsstonad: beregningResultat && ytelseTypeKode ? ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD : false,
    antallBarn: beregningResultat ? beregningResultat.antallBarn : undefined,
    aksjonspunktKoder: aksjonspunkter.filter(ap => ap.kanLoses).map(ap => ap.definisjon.kode),
    skalBrukeOverstyrendeFritekstBrev:
      (readonly && harOverstyrtMedFritekstbrev(dokumentdata, vedtakVarsel)) ||
      (!readonly &&
        (harBareFritekstbrev(tilgjengeligeVedtaksbrev) ||
          (kanHaFritekstbrev(tilgjengeligeVedtaksbrev) && harOverstyrtMedFritekstbrev(dokumentdata, vedtakVarsel)))),
    skalUndertrykkeBrev: readonly && harOverstyrtMedIngenBrev(dokumentdata, vedtakVarsel),
    overskrift: decodeHtmlEntity(dokumentdata?.[dokumentdatatype.FRITEKSTBREV]?.overskrift),
    brødtekst: decodeHtmlEntity(dokumentdata?.[dokumentdatatype.FRITEKSTBREV]?.brødtekst),
    overstyrtMottaker: JSON.stringify(dokumentdata?.[dokumentdatatype.OVERSTYRT_MOTTAKER]),
    begrunnelse: dokumentdata?.[dokumentdatatype.BEREGNING_FRITEKST],
  }),
);

export const getAksjonspunktKoder = createSelector([ownProps => ownProps.aksjonspunkter], aksjonspunkter =>
  aksjonspunkter.map(ap => ap.definisjon.kode),
);

const transformValues = (values, vedtaksbrevmaler) =>
  values.aksjonspunktKoder.map(apCode => ({
    kode: apCode,
    begrunnelse: values.begrunnelse,
    overstyrtMottaker: safeJSONParse(values.overstyrtMottaker),
    fritekstbrev: {
      brødtekst: values.brødtekst,
      overskrift: values.overskrift,
    },
    skalBrukeOverstyrendeFritekstBrev: values.skalBrukeOverstyrendeFritekstBrev,
    skalUndertrykkeBrev: values.skalUndertrykkeBrev,
    isVedtakSubmission,
    vedtaksbrevmaler,
  }));

const erArsakTypeBehandlingEtterKlage = createSelector(
  [ownProps => ownProps.behandlingArsaker],
  (behandlingArsakTyper = []) =>
    behandlingArsakTyper
      .map(({ behandlingArsakType }) => behandlingArsakType)
      .some(
        bt =>
          bt.kode === klageBehandlingArsakType.ETTER_KLAGE ||
          bt.kode === klageBehandlingArsakType.KLAGE_U_INNTK ||
          bt.kode === klageBehandlingArsakType.KLAGE_M_INNTK,
      ),
);

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values =>
    initialOwnProps.submitCallback(transformValues(values, initialOwnProps.tilgjengeligeVedtaksbrev.vedtaksbrevmaler));
  return (state, ownProps) => ({
    onSubmit,
    initialValues: buildInitialValues(ownProps),
    ...behandlingFormValueSelector(formName, ownProps.behandlingId, ownProps.behandlingVersjon)(
      state,
      'antallBarn',
      'aksjonspunktKoder',
      'skalBrukeOverstyrendeFritekstBrev',
      'skalUndertrykkeBrev',
      'brødtekst',
      'overskrift',
      'begrunnelse',
      'overstyrtMottaker',
    ),
    behandlingFormPrefix: getBehandlingFormPrefix(ownProps.behandlingId, ownProps.behandlingVersjon),
    behandlingStatusKode: ownProps.behandlingStatus.kode,
    aksjonspunktKoder: getAksjonspunktKoder(ownProps),
    erBehandlingEtterKlage: erArsakTypeBehandlingEtterKlage(ownProps),
  });
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      clearFields,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(
  injectIntl(
    behandlingForm({
      form: formName,
    })(VedtakForm),
  ),
);
