import { behandlingForm, getBehandlingFormPrefix } from '@fpsak-frontend/form';
import avklaringsbehovCodes, { harAvklaringsbehov } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import { isAvklaringsbehovOpen } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovStatus';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { change as reduxFormChange, FieldArray, formPropTypes, initialize as reduxFormInitialize } from 'redux-form';
import { createSelector } from 'reselect';
import AvklareAktiviteterPanelContent, {
  buildInitialValuesAvklarAktiviteter,
  BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME,
  MANUELL_OVERSTYRING_FIELD,
  getAvklarAktiviteter,
} from './AvklareAktiviteterPanelContent';
import beregningAvklaringsbehovPropType from '../../propTypes/beregningAvklaringsbehovPropType';
import beregningsgrunnlagPropType from '../../propTypes/beregningsgrunnlagPropType';
import {
  formNameAvklarAktiviteter,
  getFormInitialValuesForAvklarAktiviteter,
  getFormValuesForAvklarAktiviteter,
  formNameVurderFaktaBeregning,
} from '../BeregningFormUtils';
import { erOverstyringAvBeregningsgrunnlag } from '../fellesFaktaForATFLogSN/BgFordelingUtils';
import VurderAktiviteterPanel from './VurderAktiviteterPanel';

const { AVKLAR_AKTIVITETER, OVERSTYRING_AV_BEREGNINGSAKTIVITETER } = avklaringsbehovCodes;

export const erAvklartAktivitetEndret = createSelector(
  [
    (state, ownProps) => ownProps.avklaringsbehov,
    (state, ownProps) => getAvklarAktiviteter(ownProps.beregningsgrunnlag),
    getFormValuesForAvklarAktiviteter,
    getFormInitialValuesForAvklarAktiviteter,
  ],
  (avklaringsbehov, avklarAktiviteter, values, initialValues) => {
    if (!harAvklaringsbehov(AVKLAR_AKTIVITETER, avklaringsbehov) && (!values || !values[MANUELL_OVERSTYRING_FIELD])) {
      return false;
    }
    if (!!values[MANUELL_OVERSTYRING_FIELD] !== harAvklaringsbehov(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, avklaringsbehov)) {
      return true;
    }
    let harEndring = false;
    if (values && avklarAktiviteter && avklarAktiviteter.aktiviteterTomDatoMapping) {
      harEndring = VurderAktiviteterPanel.hasValueChangedFromInitial(
        avklarAktiviteter.aktiviteterTomDatoMapping,
        values,
        initialValues,
      );
    }
    if (values && !harEndring) {
      harEndring = initialValues[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] !== values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME];
    }
    return harEndring;
  },
);

const getHelpTextsAvklarAktiviteter = createSelector([ownProps => ownProps.avklaringsbehov], avklaringsbehov =>
  harAvklaringsbehov(AVKLAR_AKTIVITETER, avklaringsbehov)
    ? [
        <FormattedMessage
          key="VurderFaktaForBeregningen"
          id="BeregningInfoPanel.AksjonspunktHelpText.VurderAktiviteter"
        />,
      ]
    : [],
);

/**
 * AvklareAktiviteterPanel
 *
 * Container komponent.. Inneholder panel for å avklare om aktivitet fra opptjening skal tas med i beregning
 */

const fieldArrayName = 'avklareAktiviteterListe';
export class AvklareAktiviteterPanelImpl extends Component {
  constructor() {
    super();
    this.state = {
      submitEnabled: false,
    };
  }

  componentDidMount() {
    const { submitEnabled } = this.state;
    if (!submitEnabled) {
      this.setState({
        submitEnabled: true,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { aktivtBeregningsgrunnlagIndex, behandlingFormPrefix } = this.props;
    if (prevProps.aktivtBeregningsgrunnlagIndex !== aktivtBeregningsgrunnlagIndex) {
      const formSelectorAvklarAktiviteter = `${behandlingFormPrefix}.${formNameAvklarAktiviteter}`;
      const formSelectorVurderFaktaBeregning = `${behandlingFormPrefix}.${formNameVurderFaktaBeregning}`;

      // eslint-disable-next-line
      this.props.reduxFormChange(
        formSelectorAvklarAktiviteter,
        'aktivtBeregningsgrunnlagIndex',
        aktivtBeregningsgrunnlagIndex,
      );
      // eslint-disable-next-line
      this.props.reduxFormChange(
        formSelectorVurderFaktaBeregning,
        'aktivtBeregningsgrunnlagIndex',
        aktivtBeregningsgrunnlagIndex,
      );
    }
  }

  initializeAktiviteter() {
    const {
      reduxFormInitialize: formInitialize,
      behandlingFormPrefix,
      aktivtBeregningsgrunnlagIndex,
      alleBeregningsgrunnlag,
    } = this.props;
    const initialValues = {
      [fieldArrayName]: alleBeregningsgrunnlag.map(beregningsgrunnlag =>
        buildInitialValuesAvklarAktiviteter(beregningsgrunnlag, this.props),
      ),
      aktivtBeregningsgrunnlagIndex,
    };
    formInitialize(`${behandlingFormPrefix}.${formNameAvklarAktiviteter}`, initialValues);
  }

  render() {
    const {
      props: { harAndreAvklaringsbehovIPanel, erOverstyrt, avklaringsbehov, kanOverstyre, ...formProps },
      state: { submitEnabled },
    } = this;

    if (!harAvklaringsbehov(AVKLAR_AKTIVITETER, avklaringsbehov) && !kanOverstyre && !erOverstyrt) {
      return null;
    }

    return (
      <>
        <form onSubmit={formProps.handleSubmit}>
          <FieldArray
            name={fieldArrayName}
            component={AvklareAktiviteterPanelContent}
            props={{ ...this.props, submitEnabled }}
            initializeAktiviteter={() => this.initializeAktiviteter()}
          />
        </form>
        {harAndreAvklaringsbehovIPanel && <VerticalSpacer twentyPx />}
      </>
    );
  }
}

AvklareAktiviteterPanelImpl.propTypes = {
  aktivtBeregningsgrunnlagIndex: PropTypes.number.isRequired,
  kanOverstyre: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isAvklaringsbehovClosed: PropTypes.bool.isRequired,
  hasBegrunnelse: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  harAndreAvklaringsbehovIPanel: PropTypes.bool.isRequired,
  helpText: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  erBgOverstyrt: PropTypes.bool.isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  erOverstyrt: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  beregningsgrunnlag: beregningsgrunnlagPropType.isRequired,
  alleBeregningsgrunnlag: PropTypes.oneOfType([
    beregningsgrunnlagPropType,
    PropTypes.arrayOf(beregningsgrunnlagPropType),
  ]),
  avklaringsbehov: PropTypes.arrayOf(beregningAvklaringsbehovPropType).isRequired,
  formValues: PropTypes.shape(),
  ...formPropTypes,
};

AvklareAktiviteterPanelImpl.defaultProps = {
  formValues: undefined,
};

const skalKunneLoseAvklaringsbehov = (skalOverstyre, avklaringsbehov) =>
  skalOverstyre || harAvklaringsbehov(AVKLAR_AKTIVITETER, avklaringsbehov);

const validate = values => {
  const { avklarAktiviteter } = values;
  if (avklarAktiviteter) {
    return VurderAktiviteterPanel.validate(values, avklarAktiviteter.aktiviteterTomDatoMapping);
  }
  return {};
};

export const transformValues = (values, behandlingResultatPerioder, aktivtBg) => {
  const fieldArrayList = values[fieldArrayName];
  const harOverstyrt = fieldArrayList.some(currentFormValues => currentFormValues[MANUELL_OVERSTYRING_FIELD]);
  const valuesMedBegrunnelse = fieldArrayList.find(
    currentFormValues => !!currentFormValues[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME],
  );
  const beg = valuesMedBegrunnelse ? valuesMedBegrunnelse[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] : null;
  const løsteGrunnlag = fieldArrayList
    .filter(currentFormValues => {
      const skalOverstyre = currentFormValues[MANUELL_OVERSTYRING_FIELD];
      return skalKunneLoseAvklaringsbehov(skalOverstyre, currentFormValues.avklaringsbehov);
    })
    .map(currentFormValues => {
      const { avklarAktiviteter } = currentFormValues;
      const vurderAktiviteterTransformed = VurderAktiviteterPanel.transformValues(
        currentFormValues,
        avklarAktiviteter.aktiviteterTomDatoMapping,
      );
      const vilkarPeriode = behandlingResultatPerioder.find(
        periode => periode.periode.fom === aktivtBg.skjaeringstidspunktBeregning,
      );
      return {
        ...vurderAktiviteterTransformed,
        periode: vilkarPeriode.periode,
      };
    });
  if (harOverstyrt) {
    // K9-sak støtter i dag kun overstyring av ein periode om gangen
    return løsteGrunnlag.map(gr => 
      ({
        kode: OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
        begrunnelse: beg === undefined ? null : beg,
        ...gr,
      }));
  }
  return [
    {
      kode: AVKLAR_AKTIVITETER,
      begrunnelse: beg === undefined ? null : beg,
      grunnlag: løsteGrunnlag,
    },
  ];
};

const skalKunneOverstyre = (erOverstyrer, avklaringsbehov) =>
  erOverstyrer && !harAvklaringsbehov(AVKLAR_AKTIVITETER, avklaringsbehov);

const getIsAvklaringsbehovClosed = createSelector([ownProps => ownProps.avklaringsbehov], alleAb => {
  const relevantOpenAbs = alleAb
    .filter(
      ab =>
        ab.definisjon.kode === avklaringsbehovCodes.AVKLAR_AKTIVITETER ||
        ab.definisjon.kode === avklaringsbehovCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
    )
    .filter(ap => isAvklaringsbehovOpen(ap.status.kode));
  return relevantOpenAbs.length === 0;
});

const mapStateToPropsFactory = (initialState, initialProps) => {
  const aktivtBg = initialProps.alleBeregningsgrunnlag
    ? initialProps.alleBeregningsgrunnlag[initialProps.aktivtBeregningsgrunnlagIndex]
    : initialProps.beregningsgrunnlag;
  const onSubmit = vals =>
    initialProps.submitCallback(transformValues(vals, initialProps.behandlingResultatPerioder, aktivtBg));
  return (state, ownProps) => {
    const values = getFormValuesForAvklarAktiviteter(state, ownProps);

    const initialValues = {
      [fieldArrayName]: ownProps.alleBeregningsgrunnlag.map(beregningsgrunnlag =>
        buildInitialValuesAvklarAktiviteter(beregningsgrunnlag, ownProps),
      ),
      aktivtBeregningsgrunnlagIndex: ownProps.aktivtBeregningsgrunnlagIndex,
    };
    return {
      initialValues,
      onSubmit,
      validate,
      formValues: values,
      kanOverstyre: skalKunneOverstyre(ownProps.erOverstyrer, ownProps.avklaringsbehov || []),
      helpText: getHelpTextsAvklarAktiviteter(ownProps),
      behandlingFormPrefix: getBehandlingFormPrefix(ownProps.behandlingId, ownProps.behandlingVersjon),
      isAvklaringsbehovClosed: getIsAvklaringsbehovClosed(ownProps),
      avklarAktiviteter: getAvklarAktiviteter(ownProps.beregningsgrunnlag),
      hasBegrunnelse: initialValues && !!initialValues[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME],
      erOverstyrt: !!values && values[MANUELL_OVERSTYRING_FIELD],
      erBgOverstyrt: erOverstyringAvBeregningsgrunnlag(state, ownProps),
    };
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      reduxFormChange,
      reduxFormInitialize,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(
  behandlingForm({
    form: formNameAvklarAktiviteter,
  })(AvklareAktiviteterPanelImpl),
);
