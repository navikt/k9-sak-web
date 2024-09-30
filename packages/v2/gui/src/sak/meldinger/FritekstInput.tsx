import { type ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Tag, type TagProps, Textarea, TextField } from '@navikt/ds-react';
import { $BestillBrevDto, $FritekstbrevinnholdDto } from '@k9-sak-web/backend/k9sak/generated';
import type { Språkkode } from '@k9-sak-web/backend/k9sak/kodeverk/Språkkode.js';
import { validateTextCharacters } from '../../utils/validation/validateTextCharacters.js';
import { StickyMemoryReducer } from '../../utils/StickyMemoryReducer.js';

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
  readonly invalid: false;
}
export interface FritekstInputInvalid {
  readonly invalid: true;
  readonly tittel?: never;
  readonly tekst?: never;
}

// Sending av brev med fritekst har to ulike varianter. Ein kort enkel fritekst eller lengre tekst med tittel.
export type FritekstModus = 'EnkelFritekst' | 'StørreFritekstOgTittel';

type FritekstInputProps = {
  readonly språk: Språkkode;
  readonly show: boolean;
  readonly fritekstModus: FritekstModus;
  readonly showValidation: boolean;
  readonly defaultValue?: FritekstInputValue;
  readonly onChange?: (value: FritekstInputValue | FritekstInputInvalid) => void;
};

export interface FritekstInputMethods {
  reset(): void;
  getValue(): FritekstInputValue | FritekstInputInvalid;
}

const tittelMaxLength = $FritekstbrevinnholdDto.properties.overskrift.maxLength;
const storFritekstMaxLength = $FritekstbrevinnholdDto.properties.brødtekst.maxLength;
const litenFritekstMaxLength = $BestillBrevDto.properties.fritekst.maxLength;

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

const validateTekst = (tekst: string | undefined, fritekstModus: FritekstModus): Valid | Error => {
  const input = tekst || '';
  const fritekstMaxLength = fritekstModus === 'StørreFritekstOgTittel' ? storFritekstMaxLength : litenFritekstMaxLength;
  const len = tekst?.trim().length || 0;
  if (tekst !== undefined && len > 0 && len <= fritekstMaxLength) {
    const charValidationResult = validateTextCharacters(tekst);
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

const tekstReducer = (_: Valid | Error, newValue: { tekst: string | undefined; modus: FritekstModus }): Valid | Error =>
  validateTekst(newValue.tekst, newValue.modus);

const resolveLanguageName = (språk: Språkkode): string => {
  switch (språk.kode.toUpperCase()) {
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

const resolveLanguageTagVariant = (språk: Språkkode): TagProps['variant'] =>
  resolveLanguageName(språk) === 'Ukjent' ? 'warning' : 'info';

const stickyTittelReducer = new StickyMemoryReducer<Valid | Error>();
const stickyTekstReducer = new StickyMemoryReducer<Valid | Error>();

/**
 * Denne komponent er for at bruker skal kunne skrive inn tekst og evt tittel i brev som har fritekstinnhold.
 *
 * Ein kan bruke ref interface metode getValue() eller onChange event property for å få ut gyldig verdi eller indikator
 * for valideringsfeil.
 *
 * Ved å bruke ref interface for å hente verdi kan ein unngå hyppig re-rendering av komponent over denne.
 *
 * NB: Sidan denne bruker delt minne må ein aldri initialisere meir enn ein instans av denne.
 */
const FritekstInput = forwardRef(
  (
    { språk, show, fritekstModus, showValidation = false, defaultValue, onChange }: FritekstInputProps,
    ref: ForwardedRef<FritekstInputMethods>,
  ) => {
    const [tittel, setTittel] = stickyTittelReducer.useStickyMemoryReducer(
      tittelReducer,
      validateTittel(defaultValue?.tittel),
    );
    const [tekst, setTekst] = stickyTekstReducer.useStickyMemoryReducer(
      tekstReducer,
      validateTekst(defaultValue?.tekst, fritekstModus),
    );

    // Så vi kan detektere når default value har blitt endra etter første mount:
    const mountedDefault = useRef(defaultValue);
    useEffect(() => {
      // Når bruker velger eit nytt tekstforslag skal tekst bli overskrive.
      // For å unngå at lagra verdi blir overskrive av defaultValue ved remount av komponent, når defaultValue eigentleg
      // ikkje har blitt endra sjekker vi at defaultValue har ein anna tekstverdi enn når komponent vart mounta.
      // Ved å gjere det slik får ein beholdt innskrevet verdi i sticky memory reducer forbi unmounts + mounts, men
      // overskrive den når bruker aktivt velger eit nytt tekstforslag, eller endrer mal, etc.
      if (
        defaultValue?.tekst !== mountedDefault.current?.tekst ||
        defaultValue?.tittel !== mountedDefault.current?.tittel
      ) {
        setTittel(defaultValue?.tittel);
        setTekst({ tekst: defaultValue?.tekst, modus: fritekstModus });
      }
    }, [defaultValue]);

    const getValue = (): FritekstInputValue | FritekstInputInvalid => {
      if (tekst.valid) {
        if (fritekstModus === 'EnkelFritekst') {
          return { tittel: undefined, tekst: tekst.input, invalid: false };
        }
        if (tittel.valid) {
          return { tittel: tittel.input, tekst: tekst.input, invalid: false };
        }
      }
      return { invalid: true };
    };
    const setValue = (value: FritekstInputValue | undefined) => {
      setTittel(value?.tittel);
      setTekst({ tekst: value?.tekst, modus: fritekstModus });
    };

    useEffect(() => {
      if (onChange !== undefined) {
        onChange(getValue());
      }
    }, [tittel, tekst, fritekstModus, onChange]);
    useImperativeHandle(ref, () => {
      const reset = () => setValue(defaultValue);
      return { reset, getValue };
    });

    if (show) {
      const fritekstMaxLength =
        fritekstModus === 'StørreFritekstOgTittel' ? storFritekstMaxLength : litenFritekstMaxLength;
      return (
        <>
          {
            fritekstModus === 'StørreFritekstOgTittel' ? (
              <TextField
                value={tittel.input}
                size="small"
                label="Tittel"
                maxLength={tittelMaxLength}
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
            error={showValidation && tekst?.error}
            onChange={ev => setTekst({ tekst: ev.target.value, modus: fritekstModus })}
          />
        </>
      );
    }
    return null; // Not displaying fritekst input
  },
);

export default FritekstInput;
