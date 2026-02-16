import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import type { FeatureToggles } from '@k9-sak-web/gui/featuretoggles/FeatureToggles.js';
import AldersVilkarProsessIndex from '@k9-sak-web/gui/prosess/vilkar-alder/AldersVilkarProsessIndex.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import type { Aksjonspunkt, Behandling, KodeverkMedNavn, Vilkar } from '@k9-sak-web/types';

interface AlderProsessStegProps {
  aksjonspunkter: Aksjonspunkt[];
  alleKodeverk: KodeverkMedNavn[];
  angitteBarn: { personIdent: string }[];
  behandling: Behandling;
  fagsaksType: FagsakYtelsesType;
  featureToggles: FeatureToggles;
  formData: any;
  harBarnSoktForRammevedtakOmKroniskSyk: boolean;
  isAksjonspunktOpen: boolean;
  isReadOnly: boolean;
  readOnlySubmitButton: boolean;
  status: string;
  submitCallback: () => void;
  vilkar: Vilkar[];
  setFormData: () => any;
}

class AlderPanelDef extends ProsessStegPanelDef {
  getKomponent = (props: AlderProsessStegProps) => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    return <AldersVilkarProsessIndex {...props} {...deepCopyProps} />;
  };

  getTekstKode = () => 'Inngangsvilkar.Alder';

  getAksjonspunktKoder = () => [aksjonspunktCodes.ALDERSVILKÅR];

  getVilkarKoder = () => [vilkarType.ALDERSVILKAR_BARN];

  getOverstyrVisningAvKomponent = () => true;

  getData = ({ fagsak, soknad }) => ({
    angitteBarn: soknad.angittePersoner.filter(person => person.rolle === 'BARN'),
    fagsak,
  });
}

export default AlderPanelDef;
