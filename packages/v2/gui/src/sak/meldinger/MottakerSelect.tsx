import { Select } from '@navikt/ds-react';
import type { Template } from '@k9-sak-web/backend/k9formidling/models/Template.js';
import { type ArbeidsgiverOpplysningerPerId, type Personopplysninger } from '../../utils/formidling.js';
import {
  type Mottaker,
  type UtilgjengeligÅrsak,
  utilgjengeligÅrsaker,
} from '@k9-sak-web/backend/k9formidling/models/Mottaker.ts';

type MottakerSelectProps = {
  readonly valgtMal: Template | undefined;
  readonly valgtMottakerId: string | undefined;
  readonly personopplysninger: Personopplysninger | undefined;
  readonly arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId | undefined;
  readonly onChange?: (valgtMottaker: Mottaker | undefined) => void;
  readonly disabled?: boolean;
  readonly showValidation: boolean;
};

const unavailableErrorMsg = (reasonTxt: string | undefined): string | undefined =>
  reasonTxt !== undefined ? `Valgt mottaker er ${reasonTxt}, kan ikke sendes brev til.` : undefined;
const unavailableCauseTxt = (cause: UtilgjengeligÅrsak | undefined): string | undefined => {
  switch (cause) {
    case undefined:
      return undefined;
    case utilgjengeligÅrsaker.PERSON_DØD:
      return 'død';
    case utilgjengeligÅrsaker.ORG_OPPHØRT:
      return 'opphørt';
    default:
      console.warn(`Ukjendt årsak for unavailableCauseMsg, returnerer verdi direkte`);
      return cause;
  }
};

export const lagVisningsnavnForMottaker = (
  mottaker: Mottaker,
  personopplysninger?: Personopplysninger,
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId,
): string => {
  const utilgjengeligÅrsakTxt =
    mottaker.utilgjengelig !== undefined ? ` - ${unavailableCauseTxt(mottaker.utilgjengelig)}` : '';
  if (
    arbeidsgiverOpplysningerPerId &&
    arbeidsgiverOpplysningerPerId[mottaker.id] &&
    arbeidsgiverOpplysningerPerId[mottaker.id]?.navn
  ) {
    return `${arbeidsgiverOpplysningerPerId[mottaker.id]?.navn} (${mottaker.id})${utilgjengeligÅrsakTxt}`;
  }

  if (personopplysninger && personopplysninger.aktoerId === mottaker.id && personopplysninger.navn) {
    return `${personopplysninger.navn} (${personopplysninger.fnr || personopplysninger.nummer || mottaker.id})${utilgjengeligÅrsakTxt}`;
  }

  return mottaker.id;
};

const MottakerSelect = ({
  valgtMal,
  valgtMottakerId,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  onChange,
  disabled,
  showValidation,
}: MottakerSelectProps) => {
  const resolveMottaker = (mottakerId: string | undefined): Mottaker | undefined =>
    valgtMal?.mottakere.find(m => m.id === mottakerId);

  // If showValidation is true, check for error
  const error = showValidation
    ? (() => {
        // See if the selected mottaker is unavailable for sending, and resolve the cause if so
        const selectedReceiver = resolveMottaker(valgtMottakerId);
        const selectedReceiverUnavailableError = unavailableErrorMsg(
          unavailableCauseTxt(selectedReceiver?.utilgjengelig),
        );
        const noReceiverSelectedError = selectedReceiver === undefined ? `Ingen mottaker valgt` : undefined;
        return selectedReceiverUnavailableError || noReceiverSelectedError;
      })()
    : undefined;

  if ((valgtMal?.mottakere?.length ?? 0) > 0) {
    return (
      <Select
        label="Mottaker"
        size="small"
        placeholder="Velg mottaker"
        value={valgtMottakerId}
        onChange={e => onChange?.(resolveMottaker(e.target.value))}
        error={error}
        disabled={disabled}
      >
        {valgtMal?.mottakere.map(mottaker => (
          <option key={mottaker.id} value={mottaker.id}>
            {lagVisningsnavnForMottaker(mottaker, personopplysninger, arbeidsgiverOpplysningerPerId)}
          </option>
        ))}
      </Select>
    );
  }
  return null;
};

export default MottakerSelect;
