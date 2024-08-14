import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { guid } from '@fpsak-frontend/utils';
import {
  Aksjonspunkt,
  ArbeidsgiverOpplysningerPerId,
  BeregningsresultatUtbetalt,
  KodeverkMedNavn,
} from '@k9-sak-web/types';
import { Form } from '@navikt/ft-form-hooks';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { TilkjentYtelseFormState } from './FormState';
import PeriodeTabell from './PeriodeTabell';

interface OwnProps {
  readOnly: boolean;
  readOnlySubmitButton: boolean;
  aksjonspunkter: Aksjonspunkt[];
  behandlingId: number;
  behandlingVersjon: number;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  beregningsresultat: BeregningsresultatUtbetalt;
  submitCallback: (...args: any[]) => any;
}

export const TilkjentYtelseForm = ({
  readOnly,
  readOnlySubmitButton,
  aksjonspunkter,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  beregningsresultat,
  arbeidsgiverOpplysningerPerId,
  submitCallback,
}: OwnProps) => {
  const handleSubmit = formState => {
    submitCallback(transformValues(formState));
  };

  const buildInitialValues = (): TilkjentYtelseFormState => {
    if (beregningsresultat?.perioder) {
      return {
        arbeidsgivere: arbeidsgiverOpplysningerPerId,
        perioder: beregningsresultat.perioder.map(periode => ({
          ...periode,
          id: guid(),
          openForm: false,
          // updated: false,
        })),
      };
    }

    return {
      arbeidsgivere: arbeidsgiverOpplysningerPerId,
      perioder: [],
    };
  };

  const formMethods = useForm<TilkjentYtelseFormState>({
    defaultValues: buildInitialValues(),
  });
  return (
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

      <Form formMethods={formMethods} onSubmit={handleSubmit} data-testid="OppholdInntektOgPerioderForm">
        {/* {formProps.warning && <span>{formProps.warning}</span>} */}
        <PeriodeTabell
          // readOnlySubmitButton={readOnlySubmitButton}
          readOnly={readOnly}
          submitting={formMethods.formState.isSubmitting}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          alleKodeverk={alleKodeverk}
        />
        {formMethods.formState.errors && <span>{formMethods.formState.errors}</span>}
      </Form>
    </>
  );
};

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

// const buildInitialValues = createSelector(
//   [
//     // @ts-expect-error Migrert frå ts-ignore, uvisst kvifor denne trengs
//     (props: OwnProps) => props.beregningsresultat?.perioder,
//     (props: OwnProps) => props.arbeidsgiverOpplysningerPerId,
//   ],
//   (perioder = [], arbeidsgiverOpplysningerPerId = {}) => {
//     if (perioder) {
//       return {
//         arbeidsgivere: arbeidsgiverOpplysningerPerId,
//         perioder: perioder.map((periode: any) => ({
//           ...periode,
//           id: guid(),
//           openForm: false,
//           // updated: false,
//         })),
//       };
//     }

//     return {
//       arbeidsgivere: arbeidsgiverOpplysningerPerId,
//       perioder,
//     };
//   },
// );

export const transformValues = (values: TilkjentYtelseFormState) => [
  {
    kode: aksjonspunktCodes.MANUELL_TILKJENT_YTELSE,
    tilkjentYtelse: {
      perioder: values.perioder,
    },
    // begrunnelse: '',
  },
];

// const lagSubmitFn = createSelector(
//   [(ownProps: OwnProps) => ownProps.submitCallback, buildInitialValues],
//   submitCallback => (values: any) => submitCallback(transformValues(values)),
// );

// const mapStateToPropsFactory = (_initialState: any, props: OwnProps) => {
//   const initialValues = buildInitialValues(props);
//   const { behandlingId, behandlingVersjon } = props;

//   const validate = (values: any) => validateForm(values);

//   return (_state, ownProps) => {
//     const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);
//     return {
//       initialValues,
//       behandlingFormPrefix,
//       validate,
//       onSubmit: lagSubmitFn(ownProps),
//     };
//   };
// };

export default TilkjentYtelseForm;
