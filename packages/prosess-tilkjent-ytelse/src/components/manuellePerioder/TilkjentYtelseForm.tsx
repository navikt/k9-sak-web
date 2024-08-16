import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { guid } from '@fpsak-frontend/utils';
import {
  Aksjonspunkt,
  ArbeidsgiverOpplysningerPerId,
  BeregningsresultatUtbetalt,
  KodeverkMedNavn,
} from '@k9-sak-web/types';
import { ErrorMessage } from '@navikt/ds-react';
import { Form } from '@navikt/ft-form-hooks';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { BeriketBeregningsresultatPeriode, TilkjentYtelseFormState } from './FormState';
import PeriodeTabell from './PeriodeTabell';

const validateForm = (perioder: BeriketBeregningsresultatPeriode[]) => {
  let feilmelding = '';
  if (!perioder) {
    return undefined;
  }

  if (perioder.length === 0) {
    return 'Ingen perioder';
  }

  perioder.forEach((periode: any, index: number) => {
    const forrigePeriode = perioder[index - 1];
    const nestePeriode = periode;

    if (sjekkOverlappendePerioder(index, nestePeriode, forrigePeriode)) {
      feilmelding = 'Overlappende perioder';
    }
  });

  return feilmelding;
};

interface OwnProps {
  readOnly: boolean;
  readOnlySubmitButton: boolean;
  aksjonspunkter: Aksjonspunkt[];
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  beregningsresultat: BeregningsresultatUtbetalt;
  submitCallback: (...args: any[]) => any;
}

export const TilkjentYtelseForm = ({
  readOnly,
  readOnlySubmitButton,
  aksjonspunkter,
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

  const perioder = formMethods.watch('perioder');

  const feilmelding = validateForm(perioder);

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
        <PeriodeTabell readOnly={readOnly} alleKodeverk={alleKodeverk} />
        {feilmelding && <ErrorMessage>{feilmelding}</ErrorMessage>}
      </Form>
    </>
  );
};

export const sjekkOverlappendePerioder = (index: number, nestePeriode: any, forrigePeriode: any) =>
  index !== 0 && moment(nestePeriode.fom) <= moment(forrigePeriode.tom);

export const transformValues = (values: TilkjentYtelseFormState) => [
  {
    kode: aksjonspunktCodes.MANUELL_TILKJENT_YTELSE,
    tilkjentYtelse: {
      perioder: values.perioder,
    },
    begrunnelse: '',
  },
];

export default TilkjentYtelseForm;
