import { required } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import React, { useEffect, useState } from 'react';
import { ArbeidsgiverOpplysningerPerId, Personopplysninger } from '@k9-sak-web/types';
import KlagePart from '@k9-sak-web/behandling-klage/src/types/klagePartTsType';
import { SelectField } from '@fpsak-frontend/form/index';
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
    void (async () => {
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
