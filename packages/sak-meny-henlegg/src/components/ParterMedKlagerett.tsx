import { required } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { ArbeidsgiverOpplysningerPerId, Personopplysninger } from '@k9-sak-web/types';
import KlagePart from '@k9-sak-web/behandling-klage/src/types/klagePartTsType';
import { SelectField } from '@fpsak-frontend/form/index';
import { WrappedComponentProps } from 'react-intl';

interface OwnProps {
  hentParterMedKlagerett: () => Promise<KlagePart[]>;
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysninger?: ArbeidsgiverOpplysningerPerId;
}

function lagVisningsnavnForKlagepart(
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

const ParterMedKlagerett: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  hentParterMedKlagerett,
  personopplysninger,
  arbeidsgiverOpplysninger,
  intl,
}) => {
  const [parterMedKlagerett, setParterMedKlagerett] = useState<KlagePart[]>();

  useEffect(() => {
    (async () => {
      const parter = await hentParterMedKlagerett();
      setParterMedKlagerett(parter);
    })();
  }, []);

  return parterMedKlagerett && parterMedKlagerett.length ? (
    <>
      <SelectField
        name="valgtPartMedKlagerett"
        selectValues={parterMedKlagerett.map(part => (
          <option value={JSON.stringify(part)} key={part.identifikasjon.id}>
            {lagVisningsnavnForKlagepart(part.identifikasjon.id, personopplysninger, arbeidsgiverOpplysninger)}
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
export default ParterMedKlagerett;
