import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import React from 'react';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import AldersVilkarProsessIndex from '@k9-sak-web/prosess-vilkar-alder';
import { Aksjonspunkt, Behandling, FeatureToggles, KodeverkMedNavn, Vilkar } from '@k9-sak-web/types';

interface AlderProsessStegProps {
  aksjonspunkter: Aksjonspunkt[];
  alleKodeverk: KodeverkMedNavn[];
  angitteBarn: { personIdent: string }[];
  behandling: Behandling;
  fagsaksType: string;
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
    const { behandling, aksjonspunkter, submitCallback, isAksjonspunktOpen, isReadOnly, angitteBarn, vilkar, status } =
      props;
    return (
      <AldersVilkarProsessIndex
        behandling={behandling}
        submitCallback={submitCallback}
        aksjonspunkter={aksjonspunkter}
        isAksjonspunktOpen={isAksjonspunktOpen}
        isReadOnly={isReadOnly}
        angitteBarn={angitteBarn}
        vilkar={vilkar}
        status={status}
      />
    );
  };

  getTekstKode = () => 'Inngangsvilkar.Alder';

  getAksjonspunktKoder = () => [aksjonspunktCodes.ALDERSVILKÅR];

  getVilkarKoder = () => [vilkarType.ALDERSVILKAR_BARN];

  getOverstyrVisningAvKomponent = () => true;

  getData = ({ soknad }) => ({
    angitteBarn: soknad.angittePersoner.filter(person => person.rolle === 'BARN'),
  });
}

export default AlderPanelDef;
