import { hasValidText } from '@k9-sak-web/gui/utils/validation/validators.js';
import { maxLength } from '@navikt/ft-form-validators';
import type { ErrorOption } from 'react-hook-form';

type Tekstfelt = 'begrunnelse' | 'fritekstTilBrev';

const tekstfelter: Tekstfelt[] = ['begrunnelse', 'fritekstTilBrev'];

const maksLengde = maxLength(100000);

interface Params {
  values: Record<Tekstfelt, string | null | undefined>;
  setError: (name: Tekstfelt, error: ErrorOption) => void;
  clearErrors: (name: Tekstfelt) => void;
}

/**
 * Mellomlagring (mellomlagre-klage) krever ikke utfylte tekstfelt, men validerer tegn og lengde
 * som ved bekreftelse av aksjonspunktet. Derfor sjekkes ikke required/minLength her.
 */
export const validerTekstfelterForMellomlagring = ({ values, setError, clearErrors }: Params): boolean => {
  let erGyldig = true;
  for (const felt of tekstfelter) {
    const verdi = values[felt] ?? '';
    const feilmelding = maksLengde(verdi) || hasValidText(verdi);
    if (feilmelding) {
      setError(felt, { type: 'validate', message: feilmelding });
      erGyldig = false;
    } else {
      clearErrors(felt);
    }
  }
  return erGyldig;
};
