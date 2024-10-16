import { aksjonspunktkodeDefinisjonType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktkodeDefinisjon.js';
import AksjonspunktHelpText from '@k9-sak-web/gui/shared/aksjonspunktHelpText/AksjonspunktHelpText.js';
import type { FeatureToggles } from '@k9-sak-web/lib/kodeverk/types/FeatureTogglesType.js';
import { Form } from '@navikt/ft-form-hooks';
import { guid } from '@navikt/ft-utils';
import type { AksjonspunktDto } from '@navikt/k9-sak-typescript-client';
import { useForm } from 'react-hook-form';
import type { ArbeidsgiverOpplysningerPerId } from '../../types/arbeidsgiverOpplysningerType';
import type { BeregningsresultatMedUtbetaltePeriodeDto } from '../../types/BeregningsresultatMedUtbetaltePeriode';
import type { TilkjentYtelseFormState } from './FormState';
import PeriodeTabell from './PeriodeTabell';

interface OwnProps {
  readOnly: boolean;
  readOnlySubmitButton: boolean;
  aksjonspunkter: AksjonspunktDto[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  beregningsresultat: BeregningsresultatMedUtbetaltePeriodeDto;
  submitCallback: (...args: any[]) => any;
  featureToggles?: FeatureToggles;
}

export const TilkjentYtelseForm = ({
  readOnly,
  readOnlySubmitButton,
  aksjonspunkter,
  beregningsresultat,
  arbeidsgiverOpplysningerPerId,
  submitCallback,
  featureToggles,
}: OwnProps) => {
  const handleSubmit = (formState: TilkjentYtelseFormState) => {
    submitCallback(transformValues(formState));
  };

  const buildInitialValues = (): TilkjentYtelseFormState => ({
    arbeidsgivere: arbeidsgiverOpplysningerPerId,
    perioder:
      beregningsresultat?.perioder?.map(periode => ({
        ...periode,
        id: guid(),
        openForm: false,
      })) ?? [],
    nyArbeidsgiverForm: {
      navn: '',
      orgNr: '',
      erPrivatPerson: false,
      identifikator: '',
    },
    nyPeriodeForm: { fom: '', tom: '', andeler: [] },
  });

  const formMethods = useForm<TilkjentYtelseFormState>({
    defaultValues: buildInitialValues(),
  });

  return (
    <>
      {aksjonspunkter.length > 0 && (
        <div className="mt-5 mb-5">
          <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton}>
            {['Manuell tilkjent ytelse']}
          </AksjonspunktHelpText>
        </div>
      )}

      <Form formMethods={formMethods} onSubmit={handleSubmit} data-testid="OppholdInntektOgPerioderForm">
        <PeriodeTabell readOnly={readOnly} featureToggles={featureToggles} />
      </Form>
    </>
  );
};

export const transformValues = (values: TilkjentYtelseFormState) => [
  {
    kode: aksjonspunktkodeDefinisjonType.MANUELL_TILKJENT_YTELSE,
    tilkjentYtelse: {
      perioder: values.perioder,
    },
  },
];

export default TilkjentYtelseForm;
