import { behandlingForm, getBehandlingFormPrefix } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { guid } from '@fpsak-frontend/utils';
import {
  Aksjonspunkt,
  ArbeidsgiverOpplysningerPerId,
  BeregningsresultatUtbetalt,
  Kodeverk,
  KodeverkMedNavn,
} from '@k9-sak-web/types';
import moment from 'moment';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
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
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  vilkarForSykdomExists: boolean;
  beregningsresultat: BeregningsresultatUtbetalt[];
  submitCallback: (...args: any[]) => any;
}

const FORM_NAME = 'TilkjentYtelseForm';

export const TilkjentYtelseForm = ({
  readOnly,
  readOnlySubmitButton,
  aksjonspunkter,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  ...formProps
}: Partial<OwnProps> & InjectedFormProps) => (
  <>
    {aksjonspunkter.length > 0 && (
      <>
        <VerticalSpacer twentyPx />
        <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton}>
          {[
            <FormattedMessage
              id="TilkjentYtelse.AksjonspunktHelpText"
              key={aksjonspunktCodes.MANUELL_TILKJENT_YTELSE}
            />,
          ]}
        </AksjonspunktHelpText>
        <VerticalSpacer twentyPx />
      </>
    )}

    <form onSubmit={formProps.handleSubmit}>
      {formProps.warning && <span>{formProps.warning}</span>}
      <PeriodeTabell
        // readOnlySubmitButton={readOnlySubmitButton}
        readOnly={readOnly}
        submitting={formProps.submitting}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        alleKodeverk={alleKodeverk}
      />
      {formProps.error && <span>{formProps.error}</span>}
    </form>
  </>
);

export const sjekkOverlappendePerioder = (index: number, nestePeriode: any, forrigePeriode: any) =>
  index !== 0 && moment(nestePeriode.fom) <= moment(forrigePeriode.tom);

const validateForm = (values: any) => {
  // NOSONAR må ha disse sjekkene
  const errors = {};
  if (!values.perioder) {
    return errors;
  }

  if (values.perioder.length === 0) {
    return {
      perioder: {
        _error: <FormattedMessage id="TilkjentYtelse.IngenPerioder" />,
      },
    };
  }

  values.perioder.forEach((periode: any, index: number) => {
    const forrigePeriode = values.perioder[index - 1];
    const nestePeriode = periode;

    if (sjekkOverlappendePerioder(index, nestePeriode, forrigePeriode)) {
      return {
        perioder: {
          _error: <FormattedMessage id="TilkjentYtelse.OverlappendePerioder" />,
        },
      };
    }
    return {};
  });

  return errors;
};

// @ts-ignore
const buildInitialValues = createSelector(
  [
    // @ts-ignore
    (props: OwnProps) => props.beregningsresultat?.perioder,
    (props: OwnProps) => props.arbeidsgiverOpplysningerPerId,
  ],
  (perioder = [], arbeidsgiverOpplysningerPerId = {}) => {
    if (perioder) {
      return {
        arbeidsgivere: arbeidsgiverOpplysningerPerId,
        perioder: perioder.map((periode: any) => ({
          ...periode,
          id: guid(),
          openForm: false,
          // updated: false,
        })),
      };
    }

    return {
      arbeidsgivere: arbeidsgiverOpplysningerPerId,
      perioder,
    };
  },
);

export const transformValues = (values: any) => [
  {
    kode: aksjonspunktCodes.MANUELL_TILKJENT_YTELSE,
    tilkjentYtelse: {
      perioder: values.perioder,
    },
    // begrunnelse: '',
  },
];

const lagSubmitFn = createSelector(
  [(ownProps: OwnProps) => ownProps.submitCallback, buildInitialValues],
  submitCallback => (values: any) => submitCallback(transformValues(values)),
);

const mapStateToPropsFactory = (_initialState: any, props: OwnProps) => {
  const initialValues = buildInitialValues(props);
  const { behandlingId, behandlingVersjon } = props;

  const validate = (values: any) => validateForm(values);

  return (_state, ownProps) => {
    const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);
    return {
      initialValues,
      behandlingFormPrefix,
      validate,
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
