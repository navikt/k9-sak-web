import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import PropTypes from 'prop-types';
import { InjectedFormProps } from 'redux-form';
import {
  Aksjonspunkt,
  Kodeverk,
  BeregningsresultatUtbetalt,
  InntektArbeidYtelse,
  KodeverkMedNavn,
} from '@k9-sak-web/types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { getBehandlingFormPrefix, behandlingForm } from '@fpsak-frontend/form';
import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { guid } from '@fpsak-frontend/utils';

import { FormattedMessage } from 'react-intl';
import PeriodeTabell from './PeriodeTabell';

interface OwnProps {
  readOnly: boolean;
  readOnlySubmitButton: boolean;
  behandlingFormPrefix: string;
  submitting: boolean;
  aksjonspunkter: Aksjonspunkt[];
  behandlingId: number;
  behandlingVersjon: number;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  behandlingStatus: Kodeverk;
  inntektArbeidYtelse: InntektArbeidYtelse;
  vilkarForSykdomExists: boolean;
}

const FORM_NAME = 'TilkjentYtelseForm';

export const TilkjentYtelseForm: React.FC<OwnProps & InjectedFormProps> = ({
  readOnly,
  readOnlySubmitButton,
  aksjonspunkter,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  inntektArbeidYtelse,
  ...formProps
}) => {
  return (
    <>
      {aksjonspunkter.length > 0 && (
        <>
          <AksjonspunktHelpTextTemp isAksjonspunktOpen={!readOnlySubmitButton}>
            {[
              <FormattedMessage
                id="TilkjentYtelse.AksjonspunktHelpText"
                key={aksjonspunktCodes.MANUELL_TILKJENT_YTELSE}
              />,
            ]}
          </AksjonspunktHelpTextTemp>
          <VerticalSpacer twentyPx />
        </>
      )}

      <form onSubmit={formProps.handleSubmit}>
        {formProps.warning && <span>{formProps.warning}</span>}
        <PeriodeTabell
          // readOnlySubmitButton={readOnlySubmitButton}
          readOnly={readOnly}
          aksjonspunkter={aksjonspunkter}
          submitting={formProps.submitting}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          alleKodeverk={alleKodeverk}
          inntektArbeidYtelse={inntektArbeidYtelse}
        />
        {formProps.error && <span>{formProps.error}</span>}
      </form>
    </>
  );
};

TilkjentYtelseForm.propTypes = {
  readOnly: PropTypes.bool,
};

TilkjentYtelseForm.defaultProps = {
  readOnly: true,
};

interface PureOwnProps {
  beregningsresultat: BeregningsresultatUtbetalt[];
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
        // updated: false,
      })),
    };
  }

  return {
    perioder: [],
  };
});

export const transformValues = (values: any) => {
  return [
    {
      kode: aksjonspunktCodes.MANUELL_TILKJENT_YTELSE,
      tilkjentYtelse: {
        perioder: values.perioder,
      },
      // begrunnelse: '',
    },
  ];
};

const lagSubmitFn = createSelector(
  [(ownProps: PureOwnProps) => ownProps.submitCallback, buildInitialValues],
  submitCallback => (values: any) => submitCallback(transformValues(values)),
);

const mapStateToPropsFactory = (_initialState: any, props: PureOwnProps) => {
  const initialValues = buildInitialValues(props);
  const { behandlingId, behandlingVersjon } = props;

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
