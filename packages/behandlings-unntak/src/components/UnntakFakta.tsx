import React, { FunctionComponent } from 'react';
import { Dispatch } from 'redux';

import { injectIntl, WrappedComponentProps } from 'react-intl';
import { FagsakInfo, Rettigheter, SideMenuWrapper, faktaHooks } from '@fpsak-frontend/behandling-felles';
import { DataFetcher, DataFetcherTriggers } from '@fpsak-frontend/rest-api-redux';
import { KodeverkMedNavn, Behandling } from '@k9-sak-web/types';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { LoadingPanel } from '@fpsak-frontend/shared-components';

import unntakBehandlingApi from '../data/unntakBehandlingApi';
import faktaPanelDefinisjoner from '../panelDefinisjoner/faktaPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

const overstyringApCodes = [
  ac.OVERSTYR_AVKLAR_STARTDATO,
  ac.OVERSTYR_AVKLAR_FAKTA_UTTAK,
  ac.OVERSTYR_AVKLAR_STARTDATO,
  ac.MANUELL_AVKLAR_FAKTA_UTTAK,
  ac.OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
];

interface OwnProps {
  data: FetchedData;
  fagsak: FagsakInfo;
  behandling: Behandling;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  rettigheter: Rettigheter;
  hasFetchError: boolean;
  oppdaterProsessStegOgFaktaPanelIUrl: (prosessPanel?: string, faktanavn?: string) => void;
  valgtFaktaSteg?: string;
  valgtProsessSteg?: string;
  setApentFaktaPanel: (faktaPanelInfo: { urlCode: string; textCode: string }) => void;
  dispatch: Dispatch;
}

const UnntakFakta: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  data,
  behandling,
  fagsak,
  rettigheter,
  alleKodeverk,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtFaktaSteg,
  valgtProsessSteg,
  hasFetchError,
  setApentFaktaPanel,
  dispatch,
}) => {
  const { aksjonspunkter, vilkar, personopplysninger } = data;

  const dataTilUtledingAvFpPaneler = {
    fagsak,
    behandling,
    vilkar,
    personopplysninger,
    hasFetchError,
  };

  const [faktaPaneler, valgtPanel, sidemenyPaneler] = faktaHooks.useFaktaPaneler(
    faktaPanelDefinisjoner,
    dataTilUtledingAvFpPaneler,
    behandling,
    rettigheter,
    aksjonspunkter,
    valgtFaktaSteg,
    intl,
  );

  faktaHooks.useFaktaAksjonspunktNotifikator(faktaPaneler, setApentFaktaPanel, behandling.versjon);

  const [velgFaktaPanelCallback, bekreftAksjonspunktCallback] = faktaHooks.useCallbacks(
    faktaPaneler,
    fagsak,
    behandling,
    oppdaterProsessStegOgFaktaPanelIUrl,
    valgtProsessSteg,
    overstyringApCodes,
    unntakBehandlingApi,
    dispatch,
  );

  if (sidemenyPaneler.length > 0) {
    return (
      <SideMenuWrapper paneler={sidemenyPaneler} onClick={velgFaktaPanelCallback}>
        {valgtPanel && (
          <DataFetcher
            key={valgtPanel.getUrlKode()}
            fetchingTriggers={new DataFetcherTriggers({ behandlingVersion: behandling.versjon }, true)}
            endpoints={valgtPanel.getPanelDef().getEndepunkter()}
            loadingPanel={<LoadingPanel />}
            render={dataProps =>
              valgtPanel.getPanelDef().getKomponent({
                ...dataProps,
                behandling,
                alleKodeverk,
                submitCallback: bekreftAksjonspunktCallback,
                ...valgtPanel.getKomponentData(rettigheter, dataTilUtledingAvFpPaneler, hasFetchError),
              })
            }
          />
        )}
      </SideMenuWrapper>
    );
  }
  return null;
};

export default injectIntl(UnntakFakta);
