import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import PropTypes from 'prop-types';
import { InjectedFormProps } from 'redux-form';
import { Aksjonspunkt, Kodeverk } from '@k9-sak-web/types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn, guid } from '@fpsak-frontend/utils';
import { getBehandlingFormPrefix, behandlingForm } from '@fpsak-frontend/form';
import PeriodeTabell from './PeriodeTabell';

interface OwnProps {
  readOnly: boolean;
  hasOpenAksjonspunkter: boolean;
  behandlingFormPrefix: string;
  submitting: boolean;
  aksjonspunkter: Aksjonspunkt[];
  behandlingId: number;
  behandlingVersjon: number;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  behandlingStatus: Kodeverk;
  vilkarForSykdomExists: boolean;
}

const FORM_NAME = 'TilkjentYtelseForm';

export const TilkjentYtelseForm: React.FC<OwnProps & InjectedFormProps> = ({
  readOnly,
  hasOpenAksjonspunkter,
  aksjonspunkter,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  ...formProps
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    <form onSubmit={formProps.handleSubmit}>
      {formProps.warning && <span>{formProps.warning}</span>}
      <PeriodeTabell
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        readOnly={readOnly}
        aksjonspunkter={aksjonspunkter}
        submitting={formProps.submitting}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        alleKodeverk={alleKodeverk}
        getKodeverknavn={getKodeverknavn}
      />
      {formProps.error && <span>{formProps.error}</span>}
    </form>
  );
};

TilkjentYtelseForm.propTypes = {
  readOnly: PropTypes.bool,
};

TilkjentYtelseForm.defaultProps = {
  readOnly: true,
};

interface PureOwnProps {
  beregningsresultat: any[];
  aksjonspunkter: Aksjonspunkt[];
  behandlingId: number;
  behandlingVersjon: number;
  submitCallback: (...args: any[]) => any;
}

const buildInitialValues = createSelector([(props: PureOwnProps) => props.beregningsresultat?.perioder], perioder => {
  if (perioder) {
    return {
      perioder: perioder.map((periode: any) => ({
        ...periode,
        id: guid(),
        openForm: false,
        updated: false,
        isFromSøknad: true,
      })),
    };
  }

  return undefined;
});

export const transformValues = (values: any, initialValues) => {
  const origPeriode = initialValues.perioder.filter(p => !p.isFromSoknad);
  return {
    perioder: values.perioder,
    nyePerioder: origPeriode,
    begrunnelse: '',
    kode: aksjonspunktCodes.MANUELL_VURDERING_VILKÅR,
  };
};

const lagSubmitFn = createSelector(
  [(ownProps: PureOwnProps) => ownProps.submitCallback, buildInitialValues],
  (submitCallback, initialValues) => (values: any) => submitCallback(transformValues(values, initialValues)),
);

const mapStateToPropsFactory = (_initialState: any, props: PureOwnProps) => {
  const { behandlingId, behandlingVersjon } = props;
  const initialValues = buildInitialValues(props);

  // const validate = (values: any) => validateUttakForm(values, props.aksjonspunkter);
  // const warn = (values: any) => warningsUttakForm(values);

  return (_state, ownProps) => {
    const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);
    return {
      initialValues,
      behandlingFormPrefix,
      // validate,
      // warn,
      onSubmit: lagSubmitFn(ownProps),
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: FORM_NAME,
    enableReinitialize: true,
  })(TilkjentYtelseForm),
);
