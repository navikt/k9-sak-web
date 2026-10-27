import { RhfSelect, RhfTextField } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import type { Control, FieldValues } from 'react-hook-form';

interface Props<TForm extends FieldValues> {
  control: Control<TForm>;
  selectedId: string;
  isFormLocked: boolean;
  valgtKilde: string;
  kildeOptions: { value: string; label: string }[];
  kildeAnnetValue: string;
}

export const OpphørKilde = <TForm extends FieldValues>({
  control,
  selectedId,
  isFormLocked,
  valgtKilde,
  kildeOptions,
  kildeAnnetValue,
}: Props<TForm>) => (
  <>
    <RhfSelect
      control={control}
      name={`perioder.${selectedId}.kilde` as never}
      label="Hvor har du fått opplysningene fra?"
      description='Velg fra listen eller velg "annet" for å skrive en kort forklaring.'
      readOnly={isFormLocked}
      validate={[required]}
      selectValues={kildeOptions.map(kilde => (
        <option key={kilde.value} value={kilde.value}>
          {kilde.label}
        </option>
      ))}
    />
    {valgtKilde === kildeAnnetValue && (
      <RhfTextField
        control={control}
        name={`perioder.${selectedId}.kildeFritekst` as never}
        label="Skriv inn hvor du har fått opplysningene fra"
        readOnly={isFormLocked}
        validate={[required, minLength(3), maxLength(1000)]}
        maxLength={1000}
      />
    )}
  </>
);
