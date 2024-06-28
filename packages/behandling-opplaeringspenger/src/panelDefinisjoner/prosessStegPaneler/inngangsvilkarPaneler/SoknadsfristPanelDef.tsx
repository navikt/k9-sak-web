import React from 'react';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import SoknadsfristVilkarProsessIndex from '@k9-sak-web/prosess-vilkar-soknadsfrist';
import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { AlleKodeverk } from '@k9-sak-web/lib/kodeverk/types/AlleKodeverk.js';
import { Vilkar } from '@k9-sak-web/types';

import { OpplaeringspengerBehandlingApiKeys } from '../../../data/opplaeringspengerBehandlingApi';

class SoknadsfristPanelDef extends ProsessStegPanelDef {
  getId = () => 'SOKNADSFRIST';

  getTekstKode = () => 'Inngangsvilkar.Soknadsfrist';

  getKomponent = props => <SoknadsfristVilkarProsessIndex {...props} />;

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR,
    aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
  ];

  getVilkarKoder = () => [vilkarType.SOKNADSFRISTVILKARET];

  getEndepunkter = () => [OpplaeringspengerBehandlingApiKeys.SOKNADSFRIST_STATUS];

  getOverstyrVisningAvKomponent = ({ vilkarForSteg }) => vilkarForSteg.length > 0;

  getData = ({
    vilkarForSteg,
    alleKodeverk,
    overstyrteAksjonspunktKoder,
    prosessStegTekstKode,
    overrideReadOnly,
    kanOverstyreAccess,
    toggleOverstyring,
  }: {
    vilkarForSteg: Vilkar[];
    alleKodeverk: AlleKodeverk;
    overstyrteAksjonspunktKoder: string[];
    prosessStegTekstKode: string;
    overrideReadOnly: boolean;
    kanOverstyreAccess: boolean;
    toggleOverstyring: () => void;
  }): any => ({
    avslagsarsaker: alleKodeverk[kodeverkTyper.AVSLAGSARSAK][vilkarForSteg[0].vilkarType],
    erOverstyrt: overstyrteAksjonspunktKoder.some(o => this.getAksjonspunktKoder().some(a => a === o)),
    panelTittelKode: this.getTekstKode() ? this.getTekstKode() : prosessStegTekstKode,
    lovReferanse: vilkarForSteg.length > 0 ? vilkarForSteg[0].lovReferanse : undefined,
    overrideReadOnly,
    kanOverstyreAccess,
    toggleOverstyring,
  });
}

export default SoknadsfristPanelDef;
