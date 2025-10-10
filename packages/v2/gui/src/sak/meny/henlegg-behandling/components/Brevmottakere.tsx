import type { k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto as ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { RhfSelect } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useFormContext } from 'react-hook-form';
import type { Klagepart } from '../types/Klagepart';
import type { Personopplysninger } from '../types/Personopplysninger';

import type { HenleggBehandlingFormvalues } from './formValues';

interface OwnProps {
  brevmottakere: Klagepart[] | undefined;
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysninger?: ArbeidsgiverOversiktDto['arbeidsgivere'];
}

function lagVisningsnavnForMottakere(
  partId: string,
  personopplysninger?: Personopplysninger,
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOversiktDto['arbeidsgivere'],
): string {
  if (
    arbeidsgiverOpplysningerPerId &&
    arbeidsgiverOpplysningerPerId[partId] &&
    arbeidsgiverOpplysningerPerId[partId].navn
  ) {
    return `${arbeidsgiverOpplysningerPerId[partId].navn} (${partId})`;
  }

  if (personopplysninger && personopplysninger.aktoerId === partId) {
    return `${personopplysninger.navn} (${personopplysninger.fnr || personopplysninger.nummer || partId})`;
  }

  return partId;
}

const Brevmottakere = ({ brevmottakere, personopplysninger, arbeidsgiverOpplysninger }: OwnProps) => {
  const { control } = useFormContext<HenleggBehandlingFormvalues>();
  return brevmottakere && brevmottakere.length ? (
    <RhfSelect
      control={control}
      name="valgtMottaker"
      selectValues={brevmottakere.map(part => (
        <option value={part.identifikasjon.id} key={part.identifikasjon.id}>
          {lagVisningsnavnForMottakere(part.identifikasjon.id, personopplysninger, arbeidsgiverOpplysninger)}
        </option>
      ))}
      label="Velg mottaker av henleggelsesbrev"
      validate={[required]}
    />
  ) : null;
};
export default Brevmottakere;
