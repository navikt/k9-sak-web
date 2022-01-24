import React from 'react';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { Fagsak, Behandling } from '@k9-sak-web/types';

import MedisinskVilkår from '../../components/MedisinskVilkår';

class MedisinskVilkarFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.MEDISINSKVILKAAR;

  getTekstKode = () => 'MedisinskVilkarPanel.MedisinskVilkar';

  getAksjonspunktKoder = () => [aksjonspunktCodes.MEDISINSK_VILKAAR];

  getEndepunkter = () => [];

  getKomponent = props => 
    /*
     * TODO: sende videre de faktiske propsene
     * Dette er nåværende console.log av props her:
     * aksjonspunkter: [{…}]
     * alleKodeverk: {HistorikkEndretFeltVerdiType: Array(29), HistorikkinnslagType: Array(42), 
     * FagsakYtelseType: Array(17), DokumentTypeId: Array(2), HistorikkOpplysningType: Array(0), …}
     * alleMerknaderFraBeslutter: {9001: {…}}
     * behandling: {behandlendeEnhetId: '4409', behandlendeEnhetNavn: 'NAV Arbeid og ytelser Arendal', 
     * behandlingÅrsaker: Array(1), behandlingKoet: false, behandlingPaaVent: false, …}
     * beregningErBehandlet: false
     * dokumenter: [{…}]
     * erFagytelsetypePPN: true
     * featureToggles: {KLAGE_KABAL: false, VARSELTEKST: false, DOKUMENTDATA: false, UNNTAKSBEHANDLING: false}
     * harApneAksjonspunkter: true
     * readOnly: false
     * saksbehandlere: {}
     * submitCallback: aksjonspunkter => {…}
     * submittable: true
     */
     <MedisinskVilkår {...props} />
  

  getData = ({ hentSaksbehandlere, fagsak }) => ({
    saksbehandlere: hentSaksbehandlere?.saksbehandlere,
    erFagytelsetypePPN: fagsak.sakstype.kode === fagsakYtelseType.PLEIEPENGER_SLUTTFASE
  });

  getOverstyrVisningAvKomponent = ({ fagsak, behandling }: { fagsak: Fagsak; behandling: Behandling }) => {
    const erPleiepengesak = fagsak.sakstype.kode === fagsakYtelseType.PLEIEPENGER;
    const søknadsfristErIkkeUnderVurdering = behandling.stegTilstand?.stegType?.kode !== 'VURDER_SØKNADSFRIST';
    return erPleiepengesak && søknadsfristErIkkeUnderVurdering;
  };
}

export default MedisinskVilkarFaktaPanelDef;
