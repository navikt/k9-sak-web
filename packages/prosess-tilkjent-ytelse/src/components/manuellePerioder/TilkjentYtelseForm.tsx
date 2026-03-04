import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { guid } from '@fpsak-frontend/utils';
import { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BeregningsresultatMedUtbetaltePeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/beregningsresultat/BeregningsresultatMedUtbetaltePeriodeDto.js';
import { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/combined/kontrakt/arbeidsgiver/ArbeidsgiverOversiktDto.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { RhfForm } from '@navikt/ft-form-hooks';
import { useForm } from 'react-hook-form';
import { TilkjentYtelseFormState } from './FormState';
import PeriodeTabell from './PeriodeTabell';

interface OwnProps {
  readOnly: boolean;
  readOnlySubmitButton: boolean;
  aksjonspunkter: AksjonspunktDto[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOversiktDto['arbeidsgivere'];
  beregningsresultat: BeregningsresultatMedUtbetaltePeriodeDto;
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

      <RhfForm formMethods={formMethods} onSubmit={handleSubmit} data-testid="OppholdInntektOgPerioderForm">
        <PeriodeTabell readOnly={readOnly} />
      </RhfForm>
    </>
  );
};

export const transformValues = (values: TilkjentYtelseFormState) => [
  {
    kode: aksjonspunktCodes.MANUELL_TILKJENT_YTELSE,
    tilkjentYtelse: {
      perioder: values.perioder,
    },
  },
];

export default TilkjentYtelseForm;
