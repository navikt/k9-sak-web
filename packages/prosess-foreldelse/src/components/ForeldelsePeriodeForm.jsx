import { RadioGroupField, RadioOption, TextAreaField, behandlingForm } from '@fpsak-frontend/form';
import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import tilbakekrevingKodeverkTyper from '@fpsak-frontend/kodeverk/src/tilbakekrevingKodeverkTyper';
import { Button, Detail } from '@navikt/ds-react';
import { Column, Row } from 'nav-frontend-grid';
// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clearFields, formPropTypes } from 'redux-form';
// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import { FlexColumn, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import styles from './foreldelsePeriodeForm.module.css';
import TilbakekrevingTimelineData from './splittePerioder/TilbakekrevingTimelineData';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

export const FORELDELSE_PERIODE_FORM_NAME = 'foreldelsesresultatActivity';

export class ForeldelsePeriodeFormImpl extends Component {
  constructor() {
    super();
    this.resetFields = this.resetFields.bind(this);
  }

  resetFields() {
    const { behandlingFormPrefix, clearFields: clearFormFields, oppfylt } = this.props;
    const fields = [oppfylt];
    clearFormFields(`${behandlingFormPrefix}.${FORELDELSE_PERIODE_FORM_NAME}`, false, false, ...fields);
  }

  render() {
    const {
      skjulPeriode,
      readOnly,
      foreldelseVurderingTyper,
      periode,
      setNestePeriode,
      setForrigePeriode,
      oppdaterSplittedePerioder,
      behandlingId,
      behandlingVersjon,
      beregnBelop,
      ...formProps
    } = this.props;

    return (
      <div data-testid="foreldelseperiodeform" className={styles.container}>
        <TilbakekrevingTimelineData
          periode={periode}
          callbackForward={setNestePeriode}
          callbackBackward={setForrigePeriode}
          oppdaterSplittedePerioder={oppdaterSplittedePerioder}
          readOnly={readOnly}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          beregnBelop={beregnBelop}
        />
        <VerticalSpacer twentyPx />
        <Row>
          <Column md="6">
            <TextAreaField
              name="begrunnelse"
              label={{ id: 'ForeldelsePeriodeForm.Vurdering' }}
              validate={[required, minLength3, maxLength1500, hasValidText]}
              maxLength={1500}
              readOnly={readOnly}
              id="foreldelseVurdering"
            />
          </Column>
          <Column md="6">
            <Detail>
              <FormattedMessage id="ForeldelsePeriodeForm.RadioGroup.Foreldet" />
            </Detail>
            <VerticalSpacer eightPx />
            <RadioGroupField
              validate={[required]}
              name="foreldet"
              direction="vertical"
              readOnly={readOnly}
              onChange={this.resetFields}
            >
              {foreldelseVurderingTyper.map(type => (
                <RadioOption key={type.kode} label={type.navn} value={type.kode} />
              ))}
            </RadioGroupField>
          </Column>
        </Row>
        <VerticalSpacer twentyPx />
        <FlexRow>
          <FlexColumn>
            <Button
              variant="primary"
              size="small"
              type="button"
              onClick={formProps.handleSubmit || formProps.submitting}
              disabled={formProps.pristine}
              loading={formProps.submitting}
            >
              <FormattedMessage id="ForeldelsePeriodeForm.Oppdater" />
            </Button>
          </FlexColumn>
          <FlexColumn>
            <Button variant="secondary" size="small" type="button" onClick={skjulPeriode}>
              <FormattedMessage id="ForeldelsePeriodeForm.Avbryt" />
            </Button>
          </FlexColumn>
        </FlexRow>
      </div>
    );
  }
}

ForeldelsePeriodeFormImpl.propTypes = {
  periode: PropTypes.shape().isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  skjulPeriode: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  foreldelseVurderingTyper: PropTypes.arrayOf(kodeverkObjektPropType).isRequired,
  setNestePeriode: PropTypes.func.isRequired,
  setForrigePeriode: PropTypes.func.isRequired,
  oppdaterSplittedePerioder: PropTypes.func.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  beregnBelop: PropTypes.func.isRequired,
  ...formPropTypes,
};

const oldForeldetValue = fvType => (fvType.kode !== foreldelseVurderingType.UDEFINERT ? fvType.kode : null);
const checkForeldetValue = selectedItemData =>
  selectedItemData.foreldet ? selectedItemData.foreldet : oldForeldetValue(selectedItemData.foreldelseVurderingType);

const buildInitalValues = periode => ({
  ...periode,
  foreldet: checkForeldetValue(periode),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      clearFields,
    },
    dispatch,
  ),
});

const mapStateToPropsFactory = (initialState, ownProps) => {
  const initialValues = buildInitalValues(ownProps.periode);
  const onSubmit = values => ownProps.oppdaterPeriode(values);
  const foreldelseVurderingTyper = ownProps.alleKodeverk[tilbakekrevingKodeverkTyper.FORELDELSE_VURDERING].filter(
    fv => fv.kode !== foreldelseVurderingType.IKKE_VURDERT,
  );
  return () => ({
    initialValues,
    onSubmit,
    foreldelseVurderingTyper,
  });
};

const ForeldelsePeriodeForm = connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(
  injectIntl(
    behandlingForm({
      form: FORELDELSE_PERIODE_FORM_NAME,
      enableReinitialize: true,
    })(ForeldelsePeriodeFormImpl),
  ),
);

export default ForeldelsePeriodeForm;
