import { type sif_tilbakekreving_web_app_tjenester_behandling_dto_BehandlingDto as BehandlingDto } from '@k9-sak-web/backend/ungtilbake/generated/types.js';
import { Rettigheter, SettPaVentParams } from '@k9-sak-web/behandling-felles';
import { Fagsak, FagsakPerson, KodeverkMedNavn } from '@k9-sak-web/types';
import FetchedData from '../types/fetchedDataTsType';
import TilbakekrevingFakta from './TilbakekrevingFakta';
import TilbakekrevingProsess from './TilbakekrevingProsess';
import BehandlingPåVent from './behandlingPåVent/BehandlingPåVent';

interface OwnProps {
  fetchedData: FetchedData;
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  behandling: BehandlingDto;
  kodeverk: { [key: string]: KodeverkMedNavn[] };
  fpsakKodeverk: { [key: string]: KodeverkMedNavn[] };
  rettigheter: Rettigheter;
  valgtProsessSteg?: string;
  valgtFaktaSteg?: string;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  opneSokeside: () => void;
  harApenRevurdering: boolean;
  hasFetchError: boolean;
  setBehandling: (behandling: BehandlingDto) => void;
}

const TilbakekrevingPaneler = ({
  fetchedData,
  fagsak,
  fagsakPerson,
  behandling,
  kodeverk,
  fpsakKodeverk,
  rettigheter,
  valgtProsessSteg,
  valgtFaktaSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  oppdaterBehandlingVersjon,
  settPaVent,
  opneSokeside,
  harApenRevurdering,
  hasFetchError,
  setBehandling,
}: OwnProps) => (
  <>
    <BehandlingPåVent behandling={behandling} aksjonspunkter={fetchedData?.aksjonspunkter} settPaVent={settPaVent} />
    <TilbakekrevingProsess
      data={fetchedData}
      fagsak={fagsak}
      fagsakPerson={fagsakPerson}
      behandling={behandling}
      alleKodeverk={kodeverk}
      valgtProsessSteg={valgtProsessSteg}
      oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
      oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
      opneSokeside={opneSokeside}
      harApenRevurdering={harApenRevurdering}
      hasFetchError={hasFetchError}
      rettigheter={rettigheter}
      setBehandling={setBehandling}
    />
    <TilbakekrevingFakta
      data={fetchedData}
      fagsak={fagsak}
      behandling={behandling}
      rettigheter={rettigheter}
      alleKodeverk={kodeverk}
      fpsakKodeverk={fpsakKodeverk}
      valgtFaktaSteg={valgtFaktaSteg}
      oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
      hasFetchError={hasFetchError}
      setBehandling={setBehandling}
    />
  </>
);

export default TilbakekrevingPaneler;
