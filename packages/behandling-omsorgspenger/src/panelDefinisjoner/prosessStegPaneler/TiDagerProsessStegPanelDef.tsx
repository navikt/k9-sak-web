import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { TiDagerProsessIndex } from '@k9-sak-web/gui/prosess/ti-dager/TiDagerProsess.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { k9_kodeverk_vilkår_VilkårType } from '@navikt/k9-sak-typescript-client/types';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    return <TiDagerProsessIndex {...props} {...deepCopyProps} behandlingUUID={props.behandling.uuid} />;
  };

  getAksjonspunktKoder = () => [AksjonspunktDefinisjon.VURDER_RETT_FRA_DAG_EN];
  getVilkarKoder = () => [k9_kodeverk_vilkår_VilkårType.ARBEIDSGIVER_UTBETALT_PLIKTIGE_DAGER];

  getOverstyrVisningAvKomponent = () => false;

  getEndepunkter = () => [];

  getData = ({ arbeidsgiverOpplysningerPerId }) => ({ arbeidsgiverOpplysningerPerId });
}

class TiDagerProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.VURDER_RETT_FRA_DAG_EN;

  getTekstKode = () => 'Ti dager';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default TiDagerProsessStegPanelDef;
