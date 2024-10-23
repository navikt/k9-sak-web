import { useEffect, useState } from 'react';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { AksjonspunktBox } from '@fpsak-frontend/shared-components';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated';
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
  const aksjonspunktLost = behandling.status === behandlingStatus.BEHANDLING_UTREDES && !isAksjonspunktOpen;

  useEffect(() => {
    if (lesemodus) setRedigering(false);
    else if (relevantAksjonspunkt.kanLoses) setRedigering(true);
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
