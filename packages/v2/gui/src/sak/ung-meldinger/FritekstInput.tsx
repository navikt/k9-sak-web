import { Tag, type TagProps } from '@navikt/ds-react';
import { RhfTextarea, RhfTextField } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, required } from '@navikt/ft-form-validators';
import { useFormContext } from 'react-hook-form';

const resolveLanguageName = (språk: string): string => {
  switch (språk.toUpperCase()) {
    case 'NB':
      return 'Bokmål';
    case 'NO':
      return 'Norsk';
    case 'NN':
      return 'Nynorsk';
    case 'EN':
      return 'Engelsk';
    default:
      return 'Ukjent';
  }
};

const resolveLanguageTagVariant = (språk: string): TagProps['variant'] =>
  resolveLanguageName(språk) === 'Ukjent' ? 'warning' : 'info';

interface FritekstInputProps {
  malStøtterTittel: boolean;
  språkkode: string;
}

export const FritekstInput = (props: FritekstInputProps) => {
  const { control } = useFormContext();
  const { malStøtterTittel, språkkode } = props;
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
        label={
          <span>
            Fritekst&nbsp;&nbsp;{' '}
            <Tag size="xsmall" variant={resolveLanguageTagVariant(språkkode)}>
              {resolveLanguageName(språkkode)}
            </Tag>
          </span>
        }
        maxLength={fritekstMaxLength}
        resize="vertical"
        validate={[hasValidText, maxLength(fritekstMaxLength), required]}
      />
    </>
  );
};
