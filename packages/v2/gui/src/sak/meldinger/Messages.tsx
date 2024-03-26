import React, { useEffect, useState } from 'react';
import { Select, VStack } from '@navikt/ds-react';
import { Template } from '@k9-sak-web/backend/k9formidling/models/Template.ts';
import { FritekstbrevDokumentdata } from '@k9-sak-web/backend/k9formidling/models/FritekstbrevDokumentdata.ts';
import { YtelsesType } from '@k9-sak-web/backend/k9sak/extra/ytelseTyper.ts';
import {
  type ArbeidsgiverOpplysningerPerId,
  lagVisningsnavnForMottaker,
  type Personopplysninger,
} from '../../utils/formidling.js';

export interface BackendApi {
  hentInnholdBrevmal(sakstype: string, eksternReferanse: string, maltype: string): Promise<FritekstbrevDokumentdata[]>;
}

type MessagesProps = {
  readonly maler: Template[];
  readonly sakstype: YtelsesType;
  readonly eksternReferanse: string; // TODO Vurder om denne info skal komme inn på anna måte
  readonly personopplysninger?: Personopplysninger;
  readonly arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId;
  readonly api: BackendApi;
};

const tredjepartsmottakerValg = 'inputTredjepartsmottaker';

const Messages = ({
  maler,
  sakstype,
  eksternReferanse,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  api,
}: MessagesProps) => {
  const [valgtMalkode, setValgtMalkode] = useState<string | undefined>(maler[0]?.kode);
  const [fritekstForslag, setFritekstForslag] = useState<FritekstbrevDokumentdata[]>([]);
  const [valgtMottakerId, setValgtMottakerId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadFritekstForslag = async () => {
      if (valgtMalkode !== undefined) {
        setFritekstForslag(await api.hentInnholdBrevmal(sakstype, eksternReferanse, valgtMalkode));
      }
    };
    loadFritekstForslag();
  }, [valgtMalkode]);

  const valgtMal = maler.filter(mal => mal.kode === valgtMalkode)[0];
  useEffect(() => {
    setValgtMottakerId(valgtMal?.mottakere[0]?.id);
  }, [valgtMal]);

  const MalSelect = () => (
    <Select label="Mal" size="small" value={valgtMalkode} onChange={e => setValgtMalkode(e.target.value)}>
      {maler.map(mal => (
        <option key={mal.kode} value={mal.kode}>
          {mal.navn}
        </option>
      ))}
    </Select>
  );

  const FritekstForslagSelect = () => {
    if (fritekstForslag.length > 0) {
      return (
        <Select size="small" label="Type dokumentasjon du vil etterspørre" placeholder="Velg type">
          {fritekstForslag.map(forslag => (
              <option key={forslag.tittel} value={forslag.tittel}>
                {forslag.tittel}
              </option>
            ))}
        </Select>
      );
    }
    return null;
  };

  const MottakerSelect = () => {
    if ((valgtMal?.mottakere?.length ?? 0) > 0) {
      return (
        <Select
          label="Mottaker"
          size="small"
          placeholder="Velg mottaker"
          value={valgtMottakerId}
          onChange={e => setValgtMottakerId(e.target.value)}
        >
          {valgtMal?.mottakere.map(mottaker => (
              <option key={mottaker.id} value={mottaker.id}>
                {lagVisningsnavnForMottaker(mottaker.id, personopplysninger, arbeidsgiverOpplysningerPerId)}
              </option>
            ))}
          {valgtMal?.støtterTredjepartsmottaker && (
            <option key={tredjepartsmottakerValg} value={tredjepartsmottakerValg}>
              Tredjepartsmottaker (skriv inn organisasjonsnr)
            </option>
          )}
        </Select>
      );
    }
    return null;
  };

  return (
    <VStack gap="4">
        <MalSelect />
        <FritekstForslagSelect />
        <MottakerSelect />
      </VStack>
  );
};

export default Messages;
