import { behandlingForm, getBehandlingFormPrefix } from '@fpsak-frontend/form';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
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
import beregningAksjonspunkterPropType from '../../propTypes/beregningAksjonspunkterPropType';
import beregningsgrunnlagPropType from '../../propTypes/beregningsgrunnlagPropType';
import {
  formNameAvklarAktiviteter,
  getFormInitialValuesForAvklarAktiviteter,
  getFormValuesForAvklarAktiviteter,
  formNameVurderFaktaBeregning,
} from '../BeregningFormUtils';
import { erOverstyringAvBeregningsgrunnlag } from '../fellesFaktaForATFLogSN/BgFordelingUtils';
import VurderAktiviteterPanel from './VurderAktiviteterPanel';

const { AVKLAR_AKTIVITETER, OVERSTYRING_AV_BEREGNINGSAKTIVITETER } = aksjonspunktCodes;

export const erAvklartAktivitetEndret = createSelector(
  [
    (state, ownProps) => ownProps.aksjonspunkter,
    (state, ownProps) => getAvklarAktiviteter(ownProps.beregningsgrunnlag),
    getFormValuesForAvklarAktiviteter,
    getFormInitialValuesForAvklarAktiviteter,
  ],
  (aksjonspunkter, avklarAktiviteter, values, initialValues) => {
    if (!hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter) && (!values || !values[MANUELL_OVERSTYRING_FIELD])) {
      return false;
    }
    if (!!values[MANUELL_OVERSTYRING_FIELD] !== hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunkter)) {
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

const getHelpTextsAvklarAktiviteter = createSelector([ownProps => ownProps.aksjonspunkter], aksjonspunkter =>
  hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)
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
      props: { harAndreAksjonspunkterIPanel, erOverstyrt, aksjonspunkter, kanOverstyre, ...formProps },
      state: { submitEnabled },
    } = this;

    if (!hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter) && !kanOverstyre && !erOverstyrt) {
      return null;
    }

    return (
      <>
        <form onSubmit={formProps.handleSubmit}>
          <FieldArray
            name={fieldArrayName}
            component={AvklareAktiviteterPanelContent}
            props={{ ...this.props, submitEnabled }}
            initializeAktiviteter={() => initializeAktiviteter()}
          />
        </form>
        {harAndreAksjonspunkterIPanel && <VerticalSpacer twentyPx />}
      </>
    );
  }
}

AvklareAktiviteterPanelImpl.propTypes = {
  aktivtBeregningsgrunnlagIndex: PropTypes.number.isRequired,
  kanOverstyre: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  hasBegrunnelse: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  harAndreAksjonspunkterIPanel: PropTypes.bool.isRequired,
  helpText: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  erBgOverstyrt: PropTypes.bool.isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  erOverstyrt: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  beregningsgrunnlag: beregningsgrunnlagPropType.isRequired,
  alleBeregningsgrunnlag: PropTypes.oneOfType([
    beregningsgrunnlagPropType,
    PropTypes.arrayOf(beregningsgrunnlagPropType),
  ]),
  aksjonspunkter: PropTypes.arrayOf(beregningAksjonspunkterPropType).isRequired,
  formValues: PropTypes.shape(),
  ...formPropTypes,
};

AvklareAktiviteterPanelImpl.defaultProps = {
  formValues: undefined,
};

const skalKunneLoseAksjonspunkt = (skalOverstyre, aksjonspunkter) =>
  skalOverstyre || hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter);

const validate = values => {
  const { avklarAktiviteter } = values;
  if (avklarAktiviteter) {
    return VurderAktiviteterPanel.validate(values, avklarAktiviteter.aktiviteterTomDatoMapping);
  }
  return {};
};

export const transformValues = values => {
  const fieldArrayList = values[fieldArrayName];
  return fieldArrayList
    .filter(currentFormValues => {
      const skalOverstyre = currentFormValues[MANUELL_OVERSTYRING_FIELD];
      return skalKunneLoseAksjonspunkt(skalOverstyre, currentFormValues.aksjonspunkter);
    })
    .map(currentFormValues => {
      const { avklarAktiviteter } = currentFormValues;
      const skalOverstyre = currentFormValues[MANUELL_OVERSTYRING_FIELD];
      const vurderAktiviteterTransformed = VurderAktiviteterPanel.transformValues(
        currentFormValues,
        avklarAktiviteter.aktiviteterTomDatoMapping,
      );
      const beg = currentFormValues[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME];
      return {
        kode: skalOverstyre ? OVERSTYRING_AV_BEREGNINGSAKTIVITETER : AVKLAR_AKTIVITETER,
        begrunnelse: beg === undefined ? null : beg,
        grunnlag: [...vurderAktiviteterTransformed.beregningsaktivitetLagreDtoList],
      };
    });
};

const skalKunneOverstyre = (erOverstyrer, aksjonspunkter) =>
  erOverstyrer && !hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter);

const getIsAksjonspunktClosed = createSelector([ownProps => ownProps.aksjonspunkter], alleAp => {
  const relevantOpenAps = alleAp
    .filter(
      ap =>
        ap.definisjon.kode === aksjonspunktCodes.AVKLAR_AKTIVITETER ||
        ap.definisjon.kode === aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
    )
    .filter(ap => isAksjonspunktOpen(ap.status.kode));
  return relevantOpenAps.length === 0;
});

const mapStateToPropsFactory = (initialState, initialProps) => {
  const onSubmit = vals => {
    return initialProps.submitCallback(transformValues(vals));
  };
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
      kanOverstyre: skalKunneOverstyre(ownProps.erOverstyrer, ownProps.aksjonspunkter),
      helpText: getHelpTextsAvklarAktiviteter(ownProps),
      behandlingFormPrefix: getBehandlingFormPrefix(ownProps.behandlingId, ownProps.behandlingVersjon),
      isAksjonspunktClosed: getIsAksjonspunktClosed(ownProps),
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
