import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { formPropTypes, FieldArray } from 'redux-form';
import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { FaktaBegrunnelseTextField, FaktaSubmitButton } from '@fpsak-frontend/fp-felles';
import { behandlingForm } from '@fpsak-frontend/form';

import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import FaktaForATFLOgSNPanel, {
  getBuildInitialValuesFaktaForATFLOgSN,
  transformValuesFaktaForATFLOgSN,
  validationForVurderFakta,
} from './FaktaForATFLOgSNPanel';
import beregningsgrunnlagPropType from '../../propTypes/beregningsgrunnlagPropType';
import beregningAksjonspunkterPropType from '../../propTypes/beregningAksjonspunkterPropType';

import { erAvklartAktivitetEndret } from '../avklareAktiviteter/AvklareAktiviteterPanel';
import { formNameVurderFaktaBeregning } from '../BeregningFormUtils';
import { erOverstyring, erOverstyringAvBeregningsgrunnlag } from './BgFordelingUtils';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
  AVKLAR_AKTIVITETER,
  OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
  OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
} = aksjonspunktCodes;

const findAksjonspunktMedBegrunnelse = aksjonspunkter => {
  if (aksjonspunkter.some(ap => ap.definisjon.kode === OVERSTYRING_AV_BEREGNINGSGRUNNLAG)) {
    return aksjonspunkter.find(
      ap => ap.definisjon.kode === OVERSTYRING_AV_BEREGNINGSGRUNNLAG && ap.begrunnelse !== null,
    );
  }
  return aksjonspunkter.find(ap => ap.definisjon.kode === VURDER_FAKTA_FOR_ATFL_SN && ap.begrunnelse !== null);
};

export const BEGRUNNELSE_FAKTA_TILFELLER_NAME = 'begrunnelseFaktaTilfeller';

export const harIkkeEndringerIAvklarMedFlereAksjonspunkter = (verdiForAvklarAktivitetErEndret, aksjonspunkter) => {
  if (
    hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter) ||
    hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSGRUNNLAG, aksjonspunkter)
  ) {
    return !verdiForAvklarAktivitetErEndret;
  }
  return true;
};

const isAksjonspunktClosed = alleAp => {
  const relevantAp = alleAp.filter(
    ap =>
      ap.definisjon.kode === aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN ||
      ap.definisjon.kode === aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
  );
  return relevantAp.length === 0 ? false : relevantAp.some(ap => !isAksjonspunktOpen(ap.status.kode));
};

const lagHelpTextsForFakta = () => {
  const helpTexts = [];
  helpTexts.push(
    <FormattedMessage key="VurderFaktaForBeregningen" id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning" />,
  );
  return helpTexts;
};

const hasOpenAksjonspunkt = (kode, aksjonspunkter) =>
  aksjonspunkter.some(ap => ap.definisjon.kode === kode && isAksjonspunktOpen(ap.status.kode));

export const buildInitialValuesVurderFaktaBeregning = createSelector(
  [
    ownProps => ownProps.aksjonspunkter,
    (ownProps, beregningsgrunnlag) => getBuildInitialValuesFaktaForATFLOgSN(ownProps, beregningsgrunnlag),
  ],
  (aksjonspunkter, buildInitialValuesTilfeller) => ({
    aksjonspunkter,
    ...FaktaBegrunnelseTextField.buildInitialValues(
      findAksjonspunktMedBegrunnelse(aksjonspunkter),
      BEGRUNNELSE_FAKTA_TILFELLER_NAME,
    ),
    ...buildInitialValuesTilfeller(),
  }),
);

const fieldArrayName = 'vurderFaktaListe';

/**
 * VurderFaktaBeregningPanel
 *
 * Container komponent.. Inneholder begrunnelsefelt og komponent som innholder panelene for fakta om beregning tilfeller
 */
export class VurderFaktaBeregningPanelImpl extends Component {
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

  renderVurderFaktaBeregningPanel = ({ fields }) => {
    const {
      props: {
        beregningsgrunnlag,
        verdiForAvklarAktivitetErEndret,
        readOnly,
        submittable,
        hasBegrunnelse,
        aksjonspunkter,
        erOverstyrt,
        behandlingId,
        behandlingVersjon,
        alleKodeverk,
        erOverstyrer,
        alleBeregningsgrunnlag,
        aktivtBeregningsgrunnlagIndex,
        ...formProps
      },
      state: { submitEnabled },
    } = this;

    const harFlereBeregningsgrunnlag = Array.isArray(alleBeregningsgrunnlag);

    if (fields.length === 0) {
      if (harFlereBeregningsgrunnlag) {
        alleBeregningsgrunnlag.forEach(() => {
          const initialValues = buildInitialValuesVurderFaktaBeregning(this.props);
          fields.push(initialValues);
        });
      } else {
        const initialValues = buildInitialValuesVurderFaktaBeregning(this.props);
        fields.push(initialValues);
      }
    }

    return fields.map(
      (field, index) =>
        index === aktivtBeregningsgrunnlagIndex && (
          <div key={field}>
            {hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter) && (
              <AksjonspunktHelpTextTemp isAksjonspunktOpen={!isAksjonspunktClosed(aksjonspunkter)}>
                {lagHelpTextsForFakta()}
              </AksjonspunktHelpTextTemp>
            )}
            <VerticalSpacer twentyPx />
            <FaktaForATFLOgSNPanel
              readOnly={readOnly}
              isAksjonspunktClosed={isAksjonspunktClosed(aksjonspunkter)}
              aksjonspunkter={aksjonspunkter}
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              beregningsgrunnlag={beregningsgrunnlag}
              alleKodeverk={alleKodeverk}
              erOverstyrer={erOverstyrer}
              fieldArrayID={field}
            />
            <VerticalSpacer twentyPx />

            {(hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter) || erOverstyrt) && (
              <>
                <FaktaBegrunnelseTextField
                  name={`${field}.${BEGRUNNELSE_FAKTA_TILFELLER_NAME}`}
                  isDirty={formProps.dirty}
                  isSubmittable={submittable}
                  isReadOnly={readOnly}
                  hasBegrunnelse={hasBegrunnelse}
                />
                <VerticalSpacer twentyPx />
                <FaktaSubmitButton
                  formName={formProps.form}
                  isSubmittable={
                    submittable &&
                    submitEnabled &&
                    harIkkeEndringerIAvklarMedFlereAksjonspunkter(verdiForAvklarAktivitetErEndret, aksjonspunkter)
                  }
                  isReadOnly={readOnly}
                  hasOpenAksjonspunkter={!isAksjonspunktClosed(aksjonspunkter)}
                  behandlingId={behandlingId}
                  behandlingVersjon={behandlingVersjon}
                />
              </>
            )}
          </div>
        ),
    );
  };

  render() {
    const {
      props: { aksjonspunkter, ...formProps },
    } = this;
    return (
      <>
        {!(
          hasOpenAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter) ||
          hasOpenAksjonspunkt(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunkter)
        ) && (
          <form onSubmit={formProps.handleSubmit}>
            <FieldArray name={fieldArrayName} component={this.renderVurderFaktaBeregningPanel} />
          </form>
        )}
      </>
    );
  }
}

VurderFaktaBeregningPanelImpl.propTypes = {
  aktivtBeregningsgrunnlagIndex: PropTypes.number.isRequired,
  readOnly: PropTypes.bool.isRequired,
  hasBegrunnelse: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  verdiForAvklarAktivitetErEndret: PropTypes.bool.isRequired,
  erOverstyrt: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  beregningsgrunnlag: beregningsgrunnlagPropType.isRequired,
  alleBeregningsgrunnlag: PropTypes.oneOfType([
    beregningsgrunnlagPropType,
    PropTypes.arrayOf(beregningsgrunnlagPropType),
  ]),
  aksjonspunkter: PropTypes.arrayOf(beregningAksjonspunkterPropType).isRequired,
  ...formPropTypes,
};

export const transformValuesVurderFaktaBeregning = (values, alleBeregningsgrunnlag) => {
  const fieldArrayList = values[fieldArrayName];
  return fieldArrayList
    .filter(
      currentFormValues =>
        hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, currentFormValues.aksjonspunkter) || erOverstyring(currentFormValues),
    )
    .map((currentFormValues, index) => {
      const faktaBeregningValues = currentFormValues;
      const beg = faktaBeregningValues[BEGRUNNELSE_FAKTA_TILFELLER_NAME];
      const kode = erOverstyring(currentFormValues) ? OVERSTYRING_AV_BEREGNINGSGRUNNLAG : VURDER_FAKTA_FOR_ATFL_SN;
      return {
        '@type': kode,
        kode,
        grunnlag: [
          {
            '@type': kode,
            kode,
            begrunnelse: beg === undefined ? null : beg,
            skjæringstidspunkt: alleBeregningsgrunnlag[index].skjæringstidspunkt,
            ...transformValuesFaktaForATFLOgSN(faktaBeregningValues, erOverstyring(currentFormValues)),
          },
        ],
      };
    });
};

export const validateVurderFaktaBeregning = values => {
  const { aksjonspunkter } = values;
  if (aksjonspunkter && hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter) && values) {
    return {
      ...validationForVurderFakta(values),
    };
  }
  return null;
};

const mapStateToPropsFactory = (initialState, initialProps) => {
  const onSubmit = values =>
    initialProps.submitCallback(transformValuesVurderFaktaBeregning(values, initialProps.alleBeregningsgrunnlag));
  const validate = values => validateVurderFaktaBeregning(values);
  return (state, ownProps) => {
    const { alleBeregningsgrunnlag, aktivtBeregningsgrunnlagIndex } = ownProps;
    const initialValues = {
      [fieldArrayName]: alleBeregningsgrunnlag.map(beregningsgrunnlag => {
        return buildInitialValuesVurderFaktaBeregning(ownProps, beregningsgrunnlag);
      }),
      aktivtBeregningsgrunnlagIndex,
    };
    return {
      initialValues,
      onSubmit,
      validate,
      verdiForAvklarAktivitetErEndret: erAvklartAktivitetEndret(state, ownProps),
      erOverstyrt: erOverstyringAvBeregningsgrunnlag(state, ownProps),
      hasBegrunnelse: initialValues && !!initialValues[BEGRUNNELSE_FAKTA_TILFELLER_NAME],
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: formNameVurderFaktaBeregning,
  })(VurderFaktaBeregningPanelImpl),
);
