import KlagePart from '@k9-sak-web/behandling-klage/src/types/klagePartTsType';
import { SelectField } from '@k9-sak-web/form/index';
import { VerticalSpacer } from '@k9-sak-web/shared-components';
import { ArbeidsgiverOpplysningerPerId, Personopplysninger } from '@k9-sak-web/types';
import { required } from '@k9-sak-web/utils';
import React, { useEffect, useState } from 'react';
import { WrappedComponentProps } from 'react-intl';

interface OwnProps {
  hentMottakere: () => Promise<KlagePart[]>;
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysninger?: ArbeidsgiverOpplysningerPerId;
}

function lagVisningsnavnForMottakere(
  partId: string,
  personopplysninger?: Personopplysninger,
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId,
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

const Brevmottakere = ({
  hentMottakere,
  personopplysninger,
  arbeidsgiverOpplysninger,
  intl,
}: OwnProps & WrappedComponentProps) => {
  const [mottakere, setMottakere] = useState<KlagePart[]>();

  useEffect(() => {
    (async () => {
      const parter = await hentMottakere();
      setMottakere(parter);
    })();
  }, []);

  return mottakere && mottakere.length ? (
    <>
      <SelectField
        name="valgtMottaker"
        selectValues={mottakere.map(part => (
          <option value={JSON.stringify(part)} key={part.identifikasjon.id}>
            {lagVisningsnavnForMottakere(part.identifikasjon.id, personopplysninger, arbeidsgiverOpplysninger)}
          </option>
        ))}
        label={intl.formatMessage({ id: 'HenleggBehandlingModal.MottakerBrev' })}
        validate={[required]}
        bredde="xl"
      />
      <VerticalSpacer sixteenPx />
    </>
  ) : null;
};
export default Brevmottakere;
