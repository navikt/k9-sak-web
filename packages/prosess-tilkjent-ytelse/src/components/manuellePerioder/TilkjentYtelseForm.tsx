import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { guid } from '@fpsak-frontend/utils';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { ArbeidsgiverOpplysningerPerId, BeregningsresultatUtbetalt } from '@k9-sak-web/types';
import { Form } from '@navikt/ft-form-hooks';
import { AksjonspunktDto } from '@navikt/k9-sak-typescript-client';
import { useForm } from 'react-hook-form';
import { TilkjentYtelseFormState } from './FormState';
import PeriodeTabell from './PeriodeTabell';

interface OwnProps {
  readOnly: boolean;
  readOnlySubmitButton: boolean;
  aksjonspunkter: AksjonspunktDto[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  beregningsresultat: BeregningsresultatUtbetalt;
  submitCallback: (...args: any[]) => any;
  kodeverkNavnFraKode: (kode: string, kodeverkType: KodeverkType) => string;
}

export const TilkjentYtelseForm = ({
  readOnly,
  readOnlySubmitButton,
  aksjonspunkter,
  beregningsresultat,
  arbeidsgiverOpplysningerPerId,
  submitCallback,
}: OwnProps) => {
  const handleSubmit = formState => {
    submitCallback(transformValues(formState));
  };

  const buildInitialValues = (): TilkjentYtelseFormState => ({
    arbeidsgivere: arbeidsgiverOpplysningerPerId,
    perioder:
      beregningsresultat?.perioder.map(periode => ({
        ...periode,
        id: guid(),
        openForm: false,
      })) ?? [],
    nyArbeidsgiverForm: {
      navn: '',
      orgNr: '',
      erPrivatPerson: false,
      arbeidsforholdreferanser: [],
      identifikator: '',
    },
    nyPeriodeForm: { fom: null, tom: null, andeler: [] },
  });

  const formMethods = useForm<TilkjentYtelseFormState>({
    defaultValues: buildInitialValues(),
  });

  return (
    <>
      {aksjonspunkter.length > 0 && (
        <>
          <VerticalSpacer twentyPx />
          <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton}>
            {['Manuell tilkjent ytelse']}
          </AksjonspunktHelpText>
          <VerticalSpacer twentyPx />
        </>
      )}

      <Form formMethods={formMethods} onSubmit={handleSubmit} data-testid="OppholdInntektOgPerioderForm">
        <PeriodeTabell readOnly={readOnly} />
      </Form>
    </>
  );
};

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
