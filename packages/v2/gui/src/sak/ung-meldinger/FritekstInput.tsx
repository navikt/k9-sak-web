import { RhfTextarea, RhfTextField } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, required } from '@navikt/ft-form-validators';
import { useFormContext } from 'react-hook-form';

interface FritekstInputProps {
  malStøtterTittel: boolean;
}

export const FritekstInput = (props: FritekstInputProps) => {
  const { control } = useFormContext();
  const { malStøtterTittel } = props;
  const fritekstMaxLength = malStøtterTittel ? 100000 : 4000;
  return (
    <>
      {malStøtterTittel ? (
        <RhfTextField
          control={control}
          name="overskrift"
          size="small"
          label="Tittel"
          maxLength={200}
          validate={[hasValidText, maxLength(200), required]}
        />
      ) : null}
      <RhfTextarea
        control={control}
        name="brødtekst"
        size="small"
        label="Fritekst"
        maxLength={fritekstMaxLength}
        resize="vertical"
        validate={[hasValidText, maxLength(fritekstMaxLength), required]}
      />
    </>
  );
};
