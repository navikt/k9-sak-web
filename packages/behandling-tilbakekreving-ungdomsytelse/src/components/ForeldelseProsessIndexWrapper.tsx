import type { Behandling } from '@k9-sak-web/types';
import {
  ForeldelseProsessIndex,
  type ForeldelsesresultatActivity,
  RelasjonsRolleType,
  type VurderForeldelseAp,
} from '@navikt/ft-prosess-tilbakekreving-foreldelse';
import type React from 'react';
import { useState } from 'react';
import relasjonsRolleTypeKodeverk from '../kodeverk/relasjonsRolleTypeKodeverk';

interface ForeldelseProsessIndexWrapperProps {
  behandling: Behandling;
  perioderForeldelse: any;
  kodeverkSamling: any;
  beregnBelop: (params: any) => Promise<any>;
  alleMerknaderFraBeslutter: {
    [key: string]: {
      notAccepted?: boolean;
    };
  };
  aksjonspunkter: any[];
  submitCallback: (aksjonspunktData: VurderForeldelseAp[]) => Promise<void>;
  isReadOnly: boolean;
}

const ForeldelseProsessIndexWrapper: React.FC = (props: ForeldelseProsessIndexWrapperProps) => {
  const [formData, setFormData] = useState<ForeldelsesresultatActivity[] | undefined>(undefined);
  const {
    behandling,
    perioderForeldelse,
    submitCallback,
    isReadOnly,
    aksjonspunkter,
    beregnBelop,
    alleMerknaderFraBeslutter,
    kodeverkSamling,
  } = props;

  const submitForeldelse = (values: VurderForeldelseAp) => submitCallback([values]);

  return (
    <ForeldelseProsessIndex
      behandlingUuid={behandling.uuid}
      perioderForeldelse={perioderForeldelse}
      submitCallback={submitForeldelse}
      isReadOnly={isReadOnly}
      aksjonspunkter={aksjonspunkter}
      beregnBelop={beregnBelop}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      kodeverkSamlingFpTilbake={kodeverkSamling}
      relasjonsRolleType={RelasjonsRolleType.DELTAKER}
      relasjonsRolleTypeKodeverk={relasjonsRolleTypeKodeverk}
      setFormData={setFormData}
      formData={formData}
    />
  );
};

export default ForeldelseProsessIndexWrapper;
