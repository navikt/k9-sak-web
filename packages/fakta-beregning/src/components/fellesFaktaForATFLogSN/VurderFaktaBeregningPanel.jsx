import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
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

const harTilfeller = beregningsgrunnlag =>
  beregningsgrunnlag.faktaOmBeregning &&
  beregningsgrunnlag.faktaOmBeregning.faktaOmBeregningTilfeller &&
  beregningsgrunnlag.faktaOmBeregning.faktaOmBeregningTilfeller.length > 0;

const måVurderes = (beregningsgrunnlag, aksjonspunkter) =>
  hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter) && harTilfeller(beregningsgrunnlag);

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
        readOnly,
        aksjonspunkter,
        behandlingId,
        behandlingVersjon,
        alleKodeverk,
        arbeidsgiverOpplysningerPerId,
        erOverstyrer,
        alleBeregningsgrunnlag,
        aktivtBeregningsgrunnlagIndex,
      },
    } = this;

    const harFlereBeregningsgrunnlag = Array.isArray(alleBeregningsgrunnlag);

    if (fields.length === 0) {
      if (harFlereBeregningsgrunnlag) {
        alleBeregningsgrunnlag.forEach((bg) => {
          const initialValues = getBuildInitialValuesFaktaForATFLOgSN(this.props, bg);
          fields.push(initialValues);
        });
      } else {
        const initialValues = getBuildInitialValuesFaktaForATFLOgSN(this.props, alleBeregningsgrunnlag);
        fields.push(initialValues);
      }
    }

    const skalVurdere = måVurderes(beregningsgrunnlag, aksjonspunkter);

    return fields.map(
      (field, index) =>
        index === aktivtBeregningsgrunnlagIndex && (
          <div key={field}>
            {skalVurdere && (
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
              arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
              erOverstyrer={erOverstyrer}
              fieldArrayID={field}
            />
            <VerticalSpacer twentyPx />
          </div>
        ),
    );
  };

  render() {
    const {
      props: {
        aksjonspunkter,
        erOverstyrt,
        submittable,
        behandlingId,
        behandlingVersjon,
        verdiForAvklarAktivitetErEndret,
        hasBegrunnelse,
        readOnly,
        ...formProps
      },
      state: { submitEnabled },
    } = this;
    return (
      <>
        {!(
          hasOpenAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter) ||
          hasOpenAksjonspunkt(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunkter)
        ) && (
          <form onSubmit={formProps.handleSubmit}>
            <FieldArray name={fieldArrayName} component={this.renderVurderFaktaBeregningPanel} />
            {(hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter) || erOverstyrt) && (
              <>
                <FaktaBegrunnelseTextField
                  name={BEGRUNNELSE_FAKTA_TILFELLER_NAME}
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

const mapGrunnlagsliste = (fieldArrayList, alleBeregningsgrunnlag, behandlingResultatPerioder) => {
  return fieldArrayList
    .filter(
      (currentFormValues, index) =>
        måVurderes(alleBeregningsgrunnlag[index], currentFormValues.aksjonspunkter) || erOverstyring(currentFormValues),
    )
    .map((currentFormValues, index) => {
      const faktaBeregningValues = currentFormValues;
      const bg = alleBeregningsgrunnlag[index];
      const stpOpptjening = bg.faktaOmBeregning.avklarAktiviteter.skjæringstidspunkt;
      const vilkarPeriode = behandlingResultatPerioder.find(periode => periode.periode.fom === stpOpptjening);
      return {
        periode: vilkarPeriode.periode,
        ...transformValuesFaktaForATFLOgSN(faktaBeregningValues),
      };
    });
};

export const transformValuesVurderFaktaBeregning = (values, alleBeregningsgrunnlag, behandlingResultatPerioder) => {
  const fieldArrayList = values[fieldArrayName];
  const harOverstyring = fieldArrayList.some(currentFormValues => erOverstyring(currentFormValues));
  const beg = values[BEGRUNNELSE_FAKTA_TILFELLER_NAME];
  if (!harOverstyring && alleBeregningsgrunnlag.some(harTilfeller)) {
    return [
      {
        kode: VURDER_FAKTA_FOR_ATFL_SN,
        grunnlag: mapGrunnlagsliste(fieldArrayList, alleBeregningsgrunnlag, behandlingResultatPerioder),
        begrunnelse: beg,
      },
    ];
  }
  if (harOverstyring) {
    return mapGrunnlagsliste(fieldArrayList, alleBeregningsgrunnlag, behandlingResultatPerioder).map(gr => ({
      kode: OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
      begrunnelse: beg,
      ...gr,
    }));
  }
  return [];
};

export const validateVurderFaktaBeregning = values => {
  const { aksjonspunkter } = values;
  if (aksjonspunkter && hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter) && values) {
    return {
      [fieldArrayName]: values[fieldArrayName].map((value) => validationForVurderFakta(value))
    };
  }
  return null;
};

export const buildInitialValues = (ownProps, alleBeregningsgrunnlag, aktivtBeregningsgrunnlagIndex) => (
  {
  [fieldArrayName]: alleBeregningsgrunnlag.map(beregningsgrunnlag => ({
      aksjonspunkter: ownProps.aksjonspunkter,
      ...getBuildInitialValuesFaktaForATFLOgSN(ownProps, beregningsgrunnlag)(),

  })),
  aksjonspunkter: ownProps.aksjonspunkter,
  alleBeregningsgrunnlag,
  aktivtBeregningsgrunnlagIndex,
  ...FaktaBegrunnelseTextField.buildInitialValues(
    findAksjonspunktMedBegrunnelse(ownProps.aksjonspunkter),
    BEGRUNNELSE_FAKTA_TILFELLER_NAME)
}
);

const mapStateToPropsFactory = (initialState, initialProps) => {
  const onSubmit = values =>
    initialProps.submitCallback(
      transformValuesVurderFaktaBeregning(
        values,
        initialProps.alleBeregningsgrunnlag,
        initialProps.behandlingResultatPerioder,
      ),
    );
  return (state, ownProps) => {
    const { alleBeregningsgrunnlag, aktivtBeregningsgrunnlagIndex } = ownProps;
    const initialValues = buildInitialValues(ownProps, alleBeregningsgrunnlag, aktivtBeregningsgrunnlagIndex);
    return {
      initialValues,
      onSubmit,
      verdiForAvklarAktivitetErEndret: erAvklartAktivitetEndret(state, ownProps),
      erOverstyrt: erOverstyringAvBeregningsgrunnlag(state, ownProps),
      hasBegrunnelse: initialValues && !!initialValues[BEGRUNNELSE_FAKTA_TILFELLER_NAME],
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    validate: validateVurderFaktaBeregning,
    form: formNameVurderFaktaBeregning,
  })(VurderFaktaBeregningPanelImpl),
);
