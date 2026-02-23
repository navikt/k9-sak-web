import { Rettigheter, SettPaVentParams } from '@k9-sak-web/behandling-felles';
import { ArbeidsgiverOpplysningerPerId, Behandling, Fagsak, FagsakPerson, KodeverkMedNavn } from '@k9-sak-web/types';
import {
  ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  ung_sak_kontrakt_behandling_BehandlingDto,
  ung_sak_kontrakt_person_PersonopplysningDto,
  ung_sak_kontrakt_vilkår_VilkårMedPerioderDto,
} from '@navikt/ung-sak-typescript-client/types';
import FetchedData from '../types/FetchedData';
import { AktivitetspengerProsess } from './AktivitetspengerProsess';
import { BehandlingPåVent } from './behandlingPåVent/BehandlingPåVent';

interface OwnProps {
  aksjonspunkter: ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto[];
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  behandling: ung_sak_kontrakt_behandling_BehandlingDto;
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  fetchedData: FetchedData;
  hasFetchError: boolean;
  opneSokeside: () => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  personopplysninger: ung_sak_kontrakt_person_PersonopplysningDto;
  rettigheter: Rettigheter;
  setBehandling: (behandling: Behandling) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  valgtFaktaSteg?: string;
  valgtProsessSteg?: string;
  vilkår: ung_sak_kontrakt_vilkår_VilkårMedPerioderDto[];
}

export const AktivitetspengerPaneler = ({
  fetchedData,
  fagsak,
  fagsakPerson,
  behandling,
  alleKodeverk,
  rettigheter,
  valgtProsessSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtFaktaSteg,
  oppdaterBehandlingVersjon,
  settPaVent,
  opneSokeside,
  hasFetchError,
  setBehandling,
  arbeidsgiverOpplysningerPerId,
  aksjonspunkter,
  personopplysninger,
  vilkår,
}: OwnProps) => {
  return (
    <>
      <BehandlingPåVent
        behandling={behandling}
        aksjonspunkter={fetchedData?.aksjonspunkter ?? []}
        settPaVent={settPaVent}
      />

      <AktivitetspengerProsess
        data={fetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling}
        alleKodeverk={alleKodeverk}
        rettigheter={rettigheter}
        valgtProsessSteg={valgtProsessSteg}
        valgtFaktaSteg={valgtFaktaSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
        opneSokeside={opneSokeside}
        hasFetchError={hasFetchError}
        setBehandling={setBehandling}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        aksjonspunkter={aksjonspunkter}
        personopplysninger={personopplysninger}
        vilkår={vilkår}
      />
    </>
  );
};
