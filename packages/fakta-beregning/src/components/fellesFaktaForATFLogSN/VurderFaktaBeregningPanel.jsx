import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { FieldArray, formPropTypes } from 'redux-form';

import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { isAvklaringsbehovOpen } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovStatus';
import { behandlingForm } from '@fpsak-frontend/form';
import avklaringsbehovCodes, {
  harAvklaringsbehov,
  harAvklaringsbehovSomKanLøses,
} from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import { FaktaBegrunnelseTextField, FaktaSubmitButton } from '@k9-sak-web/fakta-felles';

import FaktaForATFLOgSNPanel, {
  getBuildInitialValuesFaktaForATFLOgSN,
  transformValuesFaktaForATFLOgSN,
  validationForVurderFakta,
} from './FaktaForATFLOgSNPanel';
import beregningsgrunnlagPropType from '../../propTypes/beregningsgrunnlagPropType';

import { erAvklartAktivitetEndret } from '../avklareAktiviteter/AvklareAktiviteterPanel';
import { formNameVurderFaktaBeregning } from '../BeregningFormUtils';
import { erOverstyring, erOverstyringAvBeregningsgrunnlag } from './BgFordelingUtils';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
  AVKLAR_AKTIVITETER,
  OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
  OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
} = avklaringsbehovCodes;

const findAvklaringsbehovMedBegrunnelse = alleBeregningsgrunnlag => {
  const alleAvklaringsbehov = alleBeregningsgrunnlag.flatMap(({ avklaringsbehov }) => avklaringsbehov);
  if (alleAvklaringsbehov.some(ab => ab.definisjon.kode === OVERSTYRING_AV_BEREGNINGSGRUNNLAG)) {
    return alleAvklaringsbehov.find(
      ab => ab.definisjon.kode === OVERSTYRING_AV_BEREGNINGSGRUNNLAG && ab.begrunnelse !== null,
    );
  }
  return alleAvklaringsbehov.find(ab => ab.definisjon.kode === VURDER_FAKTA_FOR_ATFL_SN && ab.begrunnelse !== null);
};

export const BEGRUNNELSE_FAKTA_TILFELLER_NAME = 'begrunnelseFaktaTilfeller';

export const harIkkeEndringerIAvklarAktiviteterMedFlereAvklaringsbehov = (
  verdiForAvklarAktivitetErEndret,
  avklaringsbehov,
) => {
  if (
    harAvklaringsbehov(VURDER_FAKTA_FOR_ATFL_SN, avklaringsbehov) ||
    harAvklaringsbehov(OVERSTYRING_AV_BEREGNINGSGRUNNLAG, avklaringsbehov)
  ) {
    return !verdiForAvklarAktivitetErEndret;
  }
  return true;
};

const isAvklaringsbehovClosed = alleAb => {
  const relevantAp = alleAb.filter(
    ab => ab.definisjon.kode === VURDER_FAKTA_FOR_ATFL_SN || ab.definisjon.kode === OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
  );
  return relevantAp.length === 0 ? false : relevantAp.some(ap => !isAvklaringsbehovOpen(ap.status.kode));
};

const lagHelpTextsForFakta = () => {
  const helpTexts = [];
  helpTexts.push(
    <FormattedMessage key="VurderFaktaForBeregningen" id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning" />,
  );
  return helpTexts;
};

const hasOpenAvklaringsbehov = (kode, alleBeregningsgrunnlag) => {
  if (Array.isArray(alleBeregningsgrunnlag)) {
    return alleBeregningsgrunnlag
      .flatMap(({ avklaringsbehov }) => avklaringsbehov)
      .some(ab => ab.definisjon.kode === kode && isAvklaringsbehovOpen(ab.status.kode));
  }
  return alleBeregningsgrunnlag.avklaringsbehov.some(
    ab => ab.definisjon.kode === kode && isAvklaringsbehovOpen(ab.status.kode),
  );
};

const harTilfeller = beregningsgrunnlag =>
  beregningsgrunnlag.faktaOmBeregning &&
  beregningsgrunnlag.faktaOmBeregning.faktaOmBeregningTilfeller &&
  beregningsgrunnlag.faktaOmBeregning.faktaOmBeregningTilfeller.length > 0;

const måVurderes = (avklaringsbehov, erTilVurdering) =>
  !!avklaringsbehov && harAvklaringsbehovSomKanLøses(VURDER_FAKTA_FOR_ATFL_SN, avklaringsbehov) && erTilVurdering;

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
        aktivtBeregningsgrunnlagIndex,
        readOnly,
        behandlingId,
        behandlingVersjon,
        alleKodeverk,
        arbeidsgiverOpplysningerPerId,
        erOverstyrer,
        alleBeregningsgrunnlag,
      },
    } = this;

    const harFlereBeregningsgrunnlag = Array.isArray(alleBeregningsgrunnlag);

    if (fields.length === 0) {
      if (harFlereBeregningsgrunnlag) {
        alleBeregningsgrunnlag.forEach(bg => {
          const initialValues = getBuildInitialValuesFaktaForATFLOgSN(this.props, bg);
          fields.push(initialValues);
        });
      } else {
        const initialValues = getBuildInitialValuesFaktaForATFLOgSN(this.props, alleBeregningsgrunnlag);
        fields.push(initialValues);
      }
    }

    return fields.map((field, index) => (
      <div key={field} style={{ display: index === aktivtBeregningsgrunnlagIndex ? 'block' : 'none' }}>
        {måVurderes(fields.get(index).avklaringsbehov, fields.get(index).erTilVurdering) && (
          <AksjonspunktHelpTextTemp isAksjonspunktOpen={!isAvklaringsbehovClosed(fields.get(index).avklaringsbehov)}>
            {lagHelpTextsForFakta()}
          </AksjonspunktHelpTextTemp>
        )}
        <VerticalSpacer twentyPx />
        <FaktaForATFLOgSNPanel
          readOnly={readOnly || !fields.get(index).erTilVurdering}
          isAvklaringsbehovClosed={
            isAvklaringsbehovClosed(fields.get(index).avklaringsbehov) && fields.get(index).erTilVurdering
          }
          avklaringsbehov={fields.get(index).avklaringsbehov}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          beregningsgrunnlag={alleBeregningsgrunnlag[index]}
          alleKodeverk={alleKodeverk}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          erOverstyrer={erOverstyrer}
          fieldArrayID={field}
          vilkaarPeriodeFieldArrayIndex={index}
        />
        <VerticalSpacer twentyPx />
      </div>
    ));
  };

  render() {
    const {
      props: {
        alleBeregningsgrunnlag,
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

    const avklaringsbehov = Array.isArray(alleBeregningsgrunnlag)
      ? alleBeregningsgrunnlag.flatMap(bg => bg.avklaringsbehov)
      : alleBeregningsgrunnlag.avklaringsbehov;

    return (
      // eslint-disable-next-line react/jsx-no-useless-fragment
      <>
        {!(
          hasOpenAvklaringsbehov(AVKLAR_AKTIVITETER, alleBeregningsgrunnlag) ||
          hasOpenAvklaringsbehov(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, alleBeregningsgrunnlag)
        ) && (
          <form onSubmit={formProps.handleSubmit}>
            <FieldArray name={fieldArrayName} component={this.renderVurderFaktaBeregningPanel} />
            {(harAvklaringsbehov(VURDER_FAKTA_FOR_ATFL_SN, avklaringsbehov) || erOverstyrt) && (
              <>
                <FaktaBegrunnelseTextField
                  name={BEGRUNNELSE_FAKTA_TILFELLER_NAME}
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
                    harIkkeEndringerIAvklarAktiviteterMedFlereAvklaringsbehov(
                      verdiForAvklarAktivitetErEndret,
                      avklaringsbehov,
                    )
                  }
                  isReadOnly={readOnly}
                  hasOpenAksjonspunkter={!isAvklaringsbehovClosed(avklaringsbehov)}
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
  ...formPropTypes,
};

const mapGrunnlagsliste = (fieldArrayList, behandlingResultatPerioder) =>
  fieldArrayList
    .map(currentFormValues => {
      if (
        (måVurderes(currentFormValues.avklaringsbehov, currentFormValues.erTilVurdering) ||
          erOverstyring(currentFormValues)) &&
        currentFormValues.erTilVurdering
      ) {
        const faktaBeregningValues = currentFormValues;
        const stpOpptjening = faktaBeregningValues.faktaOmBeregning.avklarAktiviteter.skjæringstidspunkt;
        const vilkarPeriode = behandlingResultatPerioder.find(periode => periode.periode.fom === stpOpptjening);
        return {
          periode: vilkarPeriode.periode,
          ...transformValuesFaktaForATFLOgSN(faktaBeregningValues),
        };
      }
      return null;
    })
    .filter(mappedValue => mappedValue !== null);

export const transformValuesVurderFaktaBeregning = (values, alleBeregningsgrunnlag, behandlingResultatPerioder) => {
  const fieldArrayList = values[fieldArrayName];
  const beg = values[BEGRUNNELSE_FAKTA_TILFELLER_NAME];
  const apForSubmit = [];
  if (
    fieldArrayList.some(
      currentFormValues =>
        !erOverstyring(currentFormValues) &&
        måVurderes(currentFormValues.avklaringsbehov, currentFormValues.erTilVurdering),
    ) &&
    alleBeregningsgrunnlag.some(harTilfeller)
  ) {
    const fieldsUtenOverstyring = fieldArrayList.filter(
      currentFormValues =>
        !erOverstyring(currentFormValues) &&
        måVurderes(currentFormValues.avklaringsbehov, currentFormValues.erTilVurdering),
    );

    apForSubmit.push({
      kode: VURDER_FAKTA_FOR_ATFL_SN,
      grunnlag: mapGrunnlagsliste(fieldsUtenOverstyring, behandlingResultatPerioder),
      begrunnelse: beg,
    });
  }
  if (fieldArrayList.some(currentFormValues => erOverstyring(currentFormValues))) {
    const fieldsMedOverstyring = fieldArrayList.filter(currentFormValues => erOverstyring(currentFormValues));
    mapGrunnlagsliste(fieldsMedOverstyring, behandlingResultatPerioder)
      .map(gr => ({
        kode: OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
        begrunnelse: beg,
        ...gr,
      }))
      .forEach(a => apForSubmit.push(a));
  }
  return apForSubmit;
};

export const validateVurderFaktaBeregning = values => {
  if (values && values[fieldArrayName]) {
    return {
      [fieldArrayName]: values[fieldArrayName].map(value => {
        if (
          (harAvklaringsbehov(VURDER_FAKTA_FOR_ATFL_SN, value.avklaringsbehov) || erOverstyring(value)) &&
          value.erTilVurdering
        ) {
          return validationForVurderFakta(value);
        }
        return {};
      }),
    };
  }
  return null;
};

export const buildInitialValues = (
  ownProps,
  alleBeregningsgrunnlag,
  aktivtBeregningsgrunnlagIndex,
  behandlingResultatPerioder,
) => ({
  [fieldArrayName]: alleBeregningsgrunnlag.map(beregningsgrunnlag => ({
    erTilVurdering: behandlingResultatPerioder.find(
      ({ periode }) => periode.fom === beregningsgrunnlag.vilkårsperiodeFom,
    ).vurderesIBehandlingen,
    avklaringsbehov: beregningsgrunnlag.avklaringsbehov,
    ...getBuildInitialValuesFaktaForATFLOgSN(ownProps, beregningsgrunnlag)(),
  })),
  alleBeregningsgrunnlag,
  aktivtBeregningsgrunnlagIndex,
  ...FaktaBegrunnelseTextField.buildInitialValues(
    findAvklaringsbehovMedBegrunnelse(alleBeregningsgrunnlag),
    BEGRUNNELSE_FAKTA_TILFELLER_NAME,
  ),
});

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
    const { alleBeregningsgrunnlag, aktivtBeregningsgrunnlagIndex, behandlingResultatPerioder } = ownProps;
    const initialValues = buildInitialValues(
      ownProps,
      alleBeregningsgrunnlag,
      aktivtBeregningsgrunnlagIndex,
      behandlingResultatPerioder,
    );
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
