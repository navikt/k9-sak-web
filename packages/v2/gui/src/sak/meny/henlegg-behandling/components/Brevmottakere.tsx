import type { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/k9sak/generated';
import { SelectField } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import type { Klagepart } from '../types/Klagepart';
import type { Personopplysninger } from '../types/Personopplysninger';

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
  return brevmottakere && brevmottakere.length ? (
    <SelectField
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
