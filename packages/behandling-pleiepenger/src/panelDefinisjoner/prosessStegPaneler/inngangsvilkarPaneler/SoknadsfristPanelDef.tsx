import React from 'react';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import SoknadsfristVilkarProsessIndex from '@k9-sak-web/prosess-vilkar-soknadsfrist';
import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { PleiepengerBehandlingApiKeys } from '../../../data/pleiepengerBehandlingApi';

class SoknadsfristPanelDef extends ProsessStegPanelDef {
  getId = () => 'SOKNADSFRIST';

  getTekstKode = () => 'Inngangsvilkar.Soknadsfrist';

  getKomponent = props => <SoknadsfristVilkarProsessIndex {...props} />;

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR,
    aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
  ];

  getVilkarKoder = () => [vilkarType.SOKNADSFRISTVILKARET];

  getEndepunkter = () => [
    PleiepengerBehandlingApiKeys.SOKNADSFRIST_STATUS,
    PleiepengerBehandlingApiKeys.HENT_SAKSBEHANDLERE,
  ];

  getOverstyrVisningAvKomponent = ({ vilkarForSteg }) => vilkarForSteg.length > 0;

  getData = ({
    vilkarForSteg,
    alleKodeverk,
    overstyrteAksjonspunktKoder,
    prosessStegTekstKode,
    overrideReadOnly,
    kanOverstyreAccess,
    toggleOverstyring,
    hentSaksbehandlere,
  }): any => ({
    avslagsarsaker: alleKodeverk[kodeverkTyper.AVSLAGSARSAK][vilkarForSteg[0].vilkarType.kode],
    erOverstyrt: overstyrteAksjonspunktKoder.some(o => this.getAksjonspunktKoder().some(a => a === o)),
    panelTittelKode: this.getTekstKode() ? this.getTekstKode() : prosessStegTekstKode,
    lovReferanse: vilkarForSteg.length > 0 ? vilkarForSteg[0].lovReferanse : undefined,
    overrideReadOnly,
    kanOverstyreAccess,
    toggleOverstyring,
    saksbehandlere: hentSaksbehandlere?.saksbehandlere,
  });
}

export default SoknadsfristPanelDef;
