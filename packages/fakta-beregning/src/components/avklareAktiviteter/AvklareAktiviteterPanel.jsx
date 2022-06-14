import { behandlingForm, getBehandlingFormPrefix } from '@fpsak-frontend/form';
import avklaringsbehovCodes, { harAvklaringsbehov, harAvklaringsbehovSomKanLøses } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import { isAvklaringsbehovOpen } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovStatus';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { change as reduxFormChange, FieldArray, formPropTypes, initialize as reduxFormInitialize } from 'redux-form';
import { createSelector } from 'reselect';
import { FaktaBegrunnelseTextField } from '@k9-sak-web/fakta-felles';
import AvklareAktiviteterPanelContent, {
  buildInitialValuesAvklarAktiviteter,
  BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME,
  MANUELL_OVERSTYRING_FIELD,
  getAvklarAktiviteter,
} from './AvklareAktiviteterPanelContent';
import beregningAvklaringsbehovPropType from '../../propTypes/beregningAvklaringsbehovPropType';
import vilkårPeriodePropType from '../../propTypes/vilkårPeriodePropType';
import beregningsgrunnlagPropType from '../../propTypes/beregningsgrunnlagPropType';
import {
  formNameAvklarAktiviteter,
  getFormInitialValuesAktivitetList,
  formNameVurderFaktaBeregning,
  getFormValuesAktivitetList,
} from '../BeregningFormUtils';
import { erOverstyringAvAktivtBeregningsgrunnlag } from '../fellesFaktaForATFLogSN/BgFordelingUtils';
import VurderAktiviteterPanel from './VurderAktiviteterPanel';

const { AVKLAR_AKTIVITETER, OVERSTYRING_AV_BEREGNINGSAKTIVITETER } = avklaringsbehovCodes;


const harEndringIAvklaring = (avklaringsbehov, avklarAktiviteter, currentValues, initialValues) => {
  if (!currentValues) {
    return false;
  }
  if (!harAvklaringsbehov(AVKLAR_AKTIVITETER, avklaringsbehov) && (!currentValues || !currentValues[MANUELL_OVERSTYRING_FIELD])) {
    return false;
  }
  if (!!currentValues[MANUELL_OVERSTYRING_FIELD] !== harAvklaringsbehov(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, avklaringsbehov)) {
    return true;
  }
  let harEndring = false;
  if (currentValues && avklarAktiviteter && avklarAktiviteter.aktiviteterTomDatoMapping) {
    harEndring = VurderAktiviteterPanel.hasValueChangedFromInitial(
      avklarAktiviteter.aktiviteterTomDatoMapping,
      currentValues,
      initialValues,
    );
  }
  if (currentValues && !harEndring) {
    harEndring = initialValues[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] !== currentValues[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME];
  }
  return harEndring;
};


export const erAvklartAktivitetEndret = createSelector(
  [
    (state, ownProps) => ownProps.alleBeregningsgrunnlag,
    getFormValuesAktivitetList,
    getFormInitialValuesAktivitetList,
  ],
  (alleBeregningsgrunnlag, valuesList, initialValuesList) =>
    alleBeregningsgrunnlag.some((bg, index) => harEndringIAvklaring(
      bg.avklaringsbehov,
      getAvklarAktiviteter(bg),
      valuesList[index],
      initialValuesList[index]))
);

const getHelpTextsAvklarAktiviteter = createSelector([ownProps => ownProps.beregningsgrunnlag.avklaringsbehov], avklaringsbehov =>
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
        buildInitialValuesAvklarAktiviteter(beregningsgrunnlag,
          this.props),
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
  behandlingResultatPerioder: PropTypes.arrayOf(vilkårPeriodePropType).isRequired,
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

const skalKunneLoseAvklaringsbehov = (skalOverstyre, avklaringsbehov, erTilVurdering) =>
  (skalOverstyre || harAvklaringsbehovSomKanLøses(AVKLAR_AKTIVITETER, avklaringsbehov)) && erTilVurdering;

const validate = values => {
  const fieldArrayList = values[fieldArrayName];
  const errors = {};

  errors[fieldArrayName] = fieldArrayList ? fieldArrayList.map((value) => {
    const { avklarAktiviteter, avklaringsbehov, manuellOverstyringBeregningAktiviteter } = value;
    if (avklarAktiviteter && skalKunneLoseAvklaringsbehov(manuellOverstyringBeregningAktiviteter, avklaringsbehov, value.erTilVurdering)) {
      return VurderAktiviteterPanel.validate(value, avklarAktiviteter.aktiviteterTomDatoMapping);
    }
    return {};
  }) : [];
  // eslint-disable-next-line no-underscore-dangle
  if (errors[fieldArrayName].find(e => !!e._error) !== undefined) {
    // Propagerer global error videre om den er satt.
    // eslint-disable-next-line no-underscore-dangle
    errors._error = errors[fieldArrayName].find(e => !!e._error)._error;
  }
  return errors;
};

export const transformValues = (values) => {
  const fieldArrayList = values[fieldArrayName];
  const harOverstyrt = fieldArrayList.some(currentFormValues => currentFormValues[MANUELL_OVERSTYRING_FIELD]);
  const beg = values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME];
  const løsteGrunnlag = fieldArrayList
    .filter(currentFormValues => {
      const skalOverstyre = currentFormValues[MANUELL_OVERSTYRING_FIELD];
      return skalKunneLoseAvklaringsbehov(skalOverstyre, currentFormValues.avklaringsbehov, currentFormValues.erTilVurdering);
    })
    .map(currentFormValues => {
      const { avklarAktiviteter } = currentFormValues;
      const vurderAktiviteterTransformed = VurderAktiviteterPanel.transformValues(
        currentFormValues,
        avklarAktiviteter.aktiviteterTomDatoMapping,
      );
      return {
        ...vurderAktiviteterTransformed,
        periode: currentFormValues.periode,
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

const getIsAvklaringsbehovClosed = createSelector([ownProps => ownProps.beregningsgrunnlag.avklaringsbehov], alleAb => {
  const relevantOpenAbs = alleAb
    .filter(
      ab =>
        ab.definisjon === avklaringsbehovCodes.AVKLAR_AKTIVITETER ||
        ab.definisjon === avklaringsbehovCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
    )
    .filter(ap => isAvklaringsbehovOpen(ap.status));
  return relevantOpenAbs.length === 0;
});

const getAvklaringsbehov = avklaringsbehov => avklaringsbehov
  .find(
    ab =>
      ab.definisjon === avklaringsbehovCodes.AVKLAR_AKTIVITETER ||
      ab.definisjon === avklaringsbehovCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
  );

const mapStateToPropsFactory = (initialState, initialProps) => {
  const aktivtBg = initialProps.alleBeregningsgrunnlag
    ? initialProps.alleBeregningsgrunnlag[initialProps.aktivtBeregningsgrunnlagIndex]
    : initialProps.beregningsgrunnlag;
  const onSubmit = vals =>
    initialProps.submitCallback(transformValues(vals));
  return (state, ownProps) => {
    const values = getFormValuesAktivitetList(state, ownProps);

    const initialValues = {
      [fieldArrayName]: ownProps.alleBeregningsgrunnlag.map(beregningsgrunnlag =>
        buildInitialValuesAvklarAktiviteter(beregningsgrunnlag, ownProps),
      ),
      aktivtBeregningsgrunnlagIndex: ownProps.aktivtBeregningsgrunnlagIndex,
      ...FaktaBegrunnelseTextField.buildInitialValues(getAvklaringsbehov(aktivtBg.avklaringsbehov), BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME),
    };
    return {
      initialValues,
      onSubmit,
      validate,
      formValues: values,
      kanOverstyre: skalKunneOverstyre(ownProps.erOverstyrer, ownProps.beregningsgrunnlag.avklaringsbehov || []),
      helpText: getHelpTextsAvklarAktiviteter(ownProps),
      behandlingFormPrefix: getBehandlingFormPrefix(ownProps.behandlingId, ownProps.behandlingVersjon),
      isAvklaringsbehovClosed: getIsAvklaringsbehovClosed(ownProps),
      avklarAktiviteter: getAvklarAktiviteter(ownProps.beregningsgrunnlag),
      hasBegrunnelse: initialValues && !!initialValues[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME],
      erBgOverstyrt: erOverstyringAvAktivtBeregningsgrunnlag(state, ownProps),
      erOverstyrt: !!values &&
        !!values[ownProps.aktivtBeregningsgrunnlagIndex] &&
        values[ownProps.aktivtBeregningsgrunnlagIndex][MANUELL_OVERSTYRING_FIELD],

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
