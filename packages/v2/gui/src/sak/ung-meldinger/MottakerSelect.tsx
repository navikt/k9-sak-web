import { type UtilgjengeligÅrsak } from '@k9-sak-web/backend/k9formidling/models/Mottaker.js';
import {
  type InformasjonsbrevMottakerValgResponse,
  type InformasjonsbrevValgDto,
} from '@k9-sak-web/backend/ungsak/generated';
import { RhfSelect } from '@navikt/ft-form-hooks';
import { useFormContext } from 'react-hook-form';
import { formatFødselsdato } from '../../utils/formatters';

interface MottakerSelectProps {
  valgtMal: InformasjonsbrevValgDto | undefined;
  disabled?: boolean;
  mottakere: Array<InformasjonsbrevMottakerValgResponse>;
}

const unavailableErrorMsg = (reasonTxt: string | undefined): string | undefined =>
  reasonTxt !== undefined ? `Valgt mottaker er ${reasonTxt}, kan ikke sendes brev til.` : undefined;
const unavailableCauseTxt = (cause: UtilgjengeligÅrsak | undefined): string | undefined => {
  switch (cause) {
    case undefined:
      return undefined;
    case 'PERSON_DØD':
      return 'død';
    default:
      console.warn(`Ukjendt utilgjengelig årsak, returnerer verdi direkte`);
      return cause;
  }
};

const MottakerSelect = ({ valgtMal, disabled, mottakere }: MottakerSelectProps) => {
  const { control } = useFormContext();
  const resolveMottaker = (mottakerId: string | undefined) => valgtMal?.mottakere?.find(m => m.id === mottakerId);

  const validateMottaker = (valgtMottakerId: string) => {
    // See if the selected mottaker is unavailable for sending, and resolve the cause if so
    const selectedReceiver = resolveMottaker(valgtMottakerId);
    const selectedReceiverUnavailableError = unavailableErrorMsg(
      unavailableCauseTxt(selectedReceiver?.utilgjengeligÅrsak),
    );
    const noReceiverSelectedError = selectedReceiver === undefined ? `Ingen mottaker valgt` : undefined;
    return selectedReceiverUnavailableError || noReceiverSelectedError;
  };

  return (
    <RhfSelect
      control={control}
      name="mottaker"
      label="Mottaker"
      size="small"
      disabled={disabled}
      selectValues={mottakere?.map(mottaker => (
        <option key={mottaker.id} value={mottaker.id}>
          {`${mottaker.navn} (${formatFødselsdato(mottaker.fødselsdato)})`}
        </option>
      ))}
      validate={[validateMottaker]}
    />
  );
};

export default MottakerSelect;
