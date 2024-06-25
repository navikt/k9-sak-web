import React, { type ForwardedRef, forwardRef, useEffect, useImperativeHandle, useReducer } from 'react';
import { Tag, type TagProps, Textarea, TextField } from '@navikt/ds-react';
import { $FritekstbrevinnholdDto } from '@k9-sak-web/backend/k9sak/generated';
import { validateTextCharacters } from '../../utils/validation/validateTextCharacters.js';

type Valid = {
  readonly input: string;
  readonly valid: true;
  readonly error?: never;
};
type Error = {
  readonly input: string;
  readonly error: string;
  readonly valid: false;
};

export interface FritekstInputValue {
  readonly tittel: string | undefined;
  readonly tekst: string | undefined;
  readonly invalid?: never;
}
export interface FritekstInputInvalid {
  readonly invalid: true;
  readonly tittel?: never;
  readonly tekst?: never;
}

type FritekstInputProps = {
  readonly språk: string;
  readonly show: boolean;
  readonly showTitle: boolean;
  readonly showValidation: boolean;
  readonly defaultValue?: FritekstInputValue;
  readonly onChange?: (value: FritekstInputValue | FritekstInputInvalid) => void;
};

export interface FritekstInputMethods {
  reset(): void;
  getValue(): FritekstInputValue | FritekstInputInvalid;
  setValue(value: FritekstInputValue): void;
}

const fritekstMaxLength = $FritekstbrevinnholdDto.properties.brødtekst.maxLength;
const tittelMaxLength = $FritekstbrevinnholdDto.properties.overskrift.maxLength;

const validateTittel = (newValue: string | undefined): Valid | Error => {
  const input = newValue || '';
  const len = newValue?.trim().length || 0;
  if (len > 0 && len <= tittelMaxLength) {
    return { valid: true, input };
  }
  if (len === 0) {
    return { valid: false, input, error: `Tittel må fylles ut` };
  }
  return { valid: false, input, error: `Tittel kan være maks ${tittelMaxLength} tegn` };
};

const tittelReducer = (_: Valid | Error, newValue: string | undefined): Valid | Error => validateTittel(newValue);

const validateTekst = (newValue: string | undefined): Valid | Error => {
  const input = newValue || '';
  const len = newValue?.trim().length || 0;
  if (newValue !== undefined && len > 0 && len <= fritekstMaxLength) {
    const charValidationResult = validateTextCharacters(newValue);
    if (charValidationResult.ok) {
      // validation ok
      return { valid: true, input };
    }
    const joinChars = (chars: string[] | never): string => chars.join(' ');
    const invalids: string = joinChars(charValidationResult.invalidCharacters);
    return { valid: false, input, error: `Ugyldige tegn: ${invalids}` };
  }
  if (len === 0) {
    return { valid: false, input, error: `Fritekst må fylles ut` };
  }
  return { valid: false, input, error: `Fritekst kan være maks ${fritekstMaxLength} tegn` };
};

const tekstReducer = (_: Valid | Error, newValue: string | undefined): Valid | Error => validateTekst(newValue);

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

/**
 * Denne komponent er for at bruker skal kunne skrive inn tekst og evt tittel i brev som har fritekstinnhold.
 *
 * Ein kan bruke ref interface metode getValue() eller onChange event property for å få ut gyldig verdi eller indikator
 * for valideringsfeil.
 *
 * Ved å bruke ref interface for å hente verdi kan ein unngå hyppig re-rendering av komponent over denne.
 */
const FritekstInput = forwardRef(
  (
    { språk, show, showTitle, showValidation = false, defaultValue, onChange }: FritekstInputProps,
    ref: ForwardedRef<FritekstInputMethods>,
  ) => {
    const [tittel, setTittel] = useReducer(tittelReducer, validateTittel(defaultValue?.tittel));
    const [tekst, setTekst] = useReducer(tekstReducer, validateTekst(defaultValue?.tekst));

    const getValue = (): FritekstInputValue | FritekstInputInvalid => {
      if (tekst.valid) {
        if (!showTitle) {
          return { tittel: undefined, tekst: tekst.input };
        }
        if (tittel.valid) {
          return { tittel: tittel.input, tekst: tekst.input };
        }
      }
      return { invalid: true };
    };
    const setValue = (value: FritekstInputValue | undefined) => {
      setTittel(value?.tekst);
      setTekst(value?.tekst);
    };

    useEffect(() => {
      if (onChange !== undefined) {
        onChange(getValue());
      }
    }, [tittel, tekst, showTitle, onChange]);
    useImperativeHandle(ref, () => {
      const reset = () => setValue(defaultValue);
      return { reset, getValue, setValue };
    });

    if (show) {
      return (
        <>
          {
            showTitle ? (
              <TextField
                value={tittel.input}
                size="small"
                label="Tittel"
                maxLength={tittelMaxLength}
                defaultValue={defaultValue?.tittel}
                error={showValidation && tittel?.error}
                onChange={ev => setTittel(ev.target.value)}
              />
            ) : null /* Not displaying tittel input */
          }
          <Textarea
            value={tekst.input}
            size="small"
            label={
              <span>
                Fritekst&nbsp;&nbsp;{' '}
                <Tag size="xsmall" variant={resolveLanguageTagVariant(språk)}>
                  {resolveLanguageName(språk)}
                </Tag>
              </span>
            }
            maxLength={fritekstMaxLength}
            resize="vertical"
            defaultValue={defaultValue?.tekst}
            error={showValidation && tekst?.error}
            onChange={ev => setTekst(ev.target.value)}
          />
        </>
      );
    }
    return null; // Not displaying fritekst input
  },
);

export default FritekstInput;
