import type { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { BehandlingStatus } from '@k9-sak-web/backend/k9sak/kodeverk/BehandlingStatus.js';
import { useEffect, useState } from 'react';
import AksjonspunktBox from '../../../shared/aksjonspunktBox/AksjonspunktBox';
import type { AldersVilkårBehandlingType } from '../types/AldersVilkårBehandlingType';
import AldersvilkarForm from './AldersvilkarForm';
import AldersvilkarLese from './AldersvilkarLese';

interface AldersVilkarAPProps {
  behandling: AldersVilkårBehandlingType;
  submitCallback: () => void;
  relevantAksjonspunkt: AksjonspunktDto;
  isReadOnly: boolean;
  angitteBarn: { personIdent: string }[];
  isAksjonspunktOpen: boolean;
  erVurdert: boolean;
  vilkarOppfylt: boolean;
  begrunnelseTekst: string;
}

const AldersVilkarAP = ({
  behandling,
  submitCallback,
  relevantAksjonspunkt,
  isReadOnly,
  angitteBarn,
  isAksjonspunktOpen,
  erVurdert,
  vilkarOppfylt,
  begrunnelseTekst,
}: AldersVilkarAPProps) => {
  const [redigering, setRedigering] = useState<boolean>(false);
  const lesemodus = isReadOnly || !isAksjonspunktOpen;
  const aksjonspunktLost = behandling.status === BehandlingStatus.UTREDES && !isAksjonspunktOpen;

  useEffect(() => {
    if (lesemodus) {
      setRedigering(false);
    } else if (relevantAksjonspunkt.kanLoses) {
      setRedigering(true);
    }
  }, [lesemodus, relevantAksjonspunkt.kanLoses]);

  if (redigering)
    return (
      <AksjonspunktBox erAksjonspunktApent={redigering}>
        <AldersvilkarForm
          relevantAksjonspunkt={relevantAksjonspunkt}
          submitCallback={submitCallback}
          begrunnelseTekst={begrunnelseTekst}
          erVilkaretOk={vilkarOppfylt}
          erVurdert={erVurdert}
          angitteBarn={angitteBarn}
        />
      </AksjonspunktBox>
    );

  return (
    <AldersvilkarLese
      aktiverRedigering={setRedigering}
      begrunnelseTekst={begrunnelseTekst}
      angitteBarn={angitteBarn}
      aksjonspunktLost={aksjonspunktLost}
      vilkarOppfylt={vilkarOppfylt}
    />
  );
};

export default AldersVilkarAP;
