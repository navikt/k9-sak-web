import React, { type ForwardedRef, forwardRef, useEffect, useImperativeHandle, useReducer } from 'react';
import { Tag, Textarea, TextField } from '@navikt/ds-react';
import { $FritekstbrevinnholdDto } from '@k9-sak-web/backend/k9sak/generated';

type Valid = {
  readonly valid: string;
  readonly error?: never;
};
type Error = {
  readonly error: string;
  readonly valid?: never;
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
  const len = newValue?.trim().length || 0;
  if (len > 0 && len <= tittelMaxLength) {
    return { valid: newValue || '' };
  }
  if (len === 0) {
    return { error: `Tittel må fylles ut` };
  }
  return { error: `Tittel kan være maks ${tittelMaxLength} tegn` };
};

const tittelReducer = (_: Valid | Error, newValue: string | undefined): Valid | Error => validateTittel(newValue);

const validateTekst = (newValue: string | undefined): Valid | Error => {
  const len = newValue?.trim().length || 0;
  if (len > 0 && len <= fritekstMaxLength) {
    // validation ok
    return { valid: newValue || '' };
  }
  if (len === 0) {
    return { error: `Fritekst må fylles ut` };
  }
  return { error: `Fritekst kan være maks ${fritekstMaxLength} tegn` };
};

const tekstReducer = (_: Valid | Error, newValue: string | undefined): Valid | Error => validateTekst(newValue);

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
      if (tekst?.valid) {
        if (!showTitle) {
          return { tittel: undefined, tekst: tekst.valid };
        }
        if (tittel?.valid) {
          return { tittel: tittel.valid, tekst: tekst.valid };
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
                value={tittel.valid || ''}
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
            value={tekst.valid || ''}
            size="small"
            label={
              <span>
                Fritekst&nbsp;&nbsp;{' '}
                <Tag size="xsmall" variant="info-moderate">
                  {språk}
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
