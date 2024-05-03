import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { Fagsak } from '@k9-sak-web/types';
import React from 'react';
import EtablertTilsyn from '../../components/EtablertTilsyn';

class EtablertTilsynFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.ETABLERT_TILSYN;

  getTekstKode = () => 'EtablertTilsynInfoPanel.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.NATTEVÅK, aksjonspunktCodes.BEREDSKAP];

  getKomponent = props => <EtablertTilsyn {...props} />;

  getOverstyrVisningAvKomponent = ({ fagsak }: { fagsak: Fagsak }) =>
    fagsak.sakstype.kode === fagsakYtelseType.PLEIEPENGER;
}

export default EtablertTilsynFaktaPanelDef;
