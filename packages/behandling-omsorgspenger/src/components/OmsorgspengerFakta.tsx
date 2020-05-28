import React, { FunctionComponent } from 'react';
import { Dispatch } from 'redux';

import { injectIntl, WrappedComponentProps } from 'react-intl';
import {
  FagsakInfo,
  Behandling,
  SideMenuWrapper,
  Kodeverk,
  NavAnsatt,
  DataFetcherBehandlingDataV2,
  faktaHooks,
} from '@fpsak-frontend/behandling-felles';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import omsorgspengerBehandlingApi from '../data/omsorgspengerBehandlingApi';
import faktaPanelDefinisjoner from '../panelDefinisjoner/faktaOmsorgspengerPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

const overstyringApCodes = [
  ac.OVERSTYR_AVKLAR_STARTDATO,
  ac.OVERSTYR_AVKLAR_FAKTA_UTTAK,
  ac.OVERSTYR_AVKLAR_STARTDATO,
  ac.MANUELL_AVKLAR_FAKTA_UTTAK,
  ac.OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
  ac.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
];

interface OwnProps {
  data: FetchedData;
  fagsak: FagsakInfo;
  behandling: Behandling;
  alleKodeverk: { [key: string]: Kodeverk[] };
  navAnsatt: NavAnsatt;
  hasFetchError: boolean;
  oppdaterProsessStegOgFaktaPanelIUrl: (prosessPanel?: string, faktanavn?: string) => void;
  valgtFaktaSteg?: string;
  valgtProsessSteg?: string;
  setApentFaktaPanel: (faktaPanelInfo: { urlCode: string; textCode: string }) => void;
  dispatch: Dispatch;
}

const OmsorgspengerFakta: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  data,
  behandling,
  fagsak,
  navAnsatt,
  alleKodeverk,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtFaktaSteg,
  valgtProsessSteg,
  hasFetchError,
  setApentFaktaPanel,
  dispatch,
}) => {
  const {
    aksjonspunkter,
    soknad,
    vilkar,
    personopplysninger,
    inntektArbeidYtelse,
    beregningsgrunnlag,
    sykdom,
    omsorgenFor,
    forbrukteDager,
  } = data;

  const dataTilUtledingAvFpPaneler = {
    fagsak,
    behandling,
    soknad,
    vilkar,
    personopplysninger,
    inntektArbeidYtelse,
    beregningsgrunnlag,
    hasFetchError,
    sykdom,
    omsorgenFor,
    forbrukteDager,
  };

  const [faktaPaneler, valgtPanel, formaterteFaktaPaneler] = faktaHooks.useFaktaPaneler(
    faktaPanelDefinisjoner,
    dataTilUtledingAvFpPaneler,
    fagsak,
    behandling,
    navAnsatt,
    aksjonspunkter,
    hasFetchError,
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
    omsorgspengerBehandlingApi,
    dispatch,
  );

  if (valgtPanel) {
    return (
      <SideMenuWrapper paneler={formaterteFaktaPaneler} onClick={velgFaktaPanelCallback}>
        <DataFetcherBehandlingDataV2
          key={valgtPanel.urlCode}
          behandlingVersion={behandling.versjon}
          endpoints={valgtPanel.endpoints}
          render={dataProps =>
            valgtPanel.renderComponent({
              ...dataProps,
              behandling,
              alleKodeverk,
              submitCallback: bekreftAksjonspunktCallback,
              ...valgtPanel.komponentData,
            })
          }
        />
      </SideMenuWrapper>
    );
  }
  return null;
};

export default injectIntl(OmsorgspengerFakta);
